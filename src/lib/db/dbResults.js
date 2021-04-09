/* eslint-disable */

const db = require("./db");
const utils = require("../utils");
const moment = require("moment");

/**
 * Helper function for getResults to format the results properly.
 * @param  {Array} rows
 *         The rows of raw data retrieved from getResults.
 * @return {Array}
 *         An object: {quizData, sessionData}, wrapped in an array.
 *         (The array wrapper is for consistency, since the
 *         server expects all DB functions to return an array)
 *
 */
const parseResults = (rows) => {
  // If there's no results, just return an empty array
  if (rows.length === 0) {
    return rows;
  }
  // Some data is the same in every row, so we save a single row
  // to extract all that data before parsing the other rows.
  singletonRow = rows[0];
  const quizData = {
    id: singletonRow.quiz_id,
    author_id: singletonRow.author_id,
    title: singletonRow.title,
    description: singletonRow.description,
    category_id: singletonRow.category_id
  };

  // Now we deal with the rows that have unique data.
  const responses = [];
  let correct_answers = 0;
  let currentQuestionID = rows[0].question_id;
  let response = { question: rows[0].question};
  for (let row of rows) {
    // Start a new question if we need to
    if (currentQuestionID !== row.question_id) {
      responses.push(response);
      response = {};
      response.question = row.question;
      currentQuestionID = row.question_id;
    }
    let {
      answer,
      chosen_answer,
      is_correct
    } = row;
    if (chosen_answer) {
      response.answer = {
        answer,
        is_correct
      };
    }
    if (is_correct) {
      response.actual_answer = answer;
    }
  }
  // Push the last response in
  responses.push(response);

  // Bundle some singleton data with the extracted responses data.
  const sessionData = {
    id: singletonRow.session_id,
    user_id: singletonRow.user_id || null,
    username: singletonRow.username || "Anonymous",
    duration: utils.convertTimestamp(singletonRow.start_time, singletonRow.end_time),
    end_time: moment(singletonRow.end_time).format("LLLL"),
    correct_answers,
    responses
  };
  return [{
    quizData,
    sessionData
  }];
};

module.exports = {

  /**
   * Retrieves the results of a single quiz session.
   * Uses parseResults() before returning data.
   * @param  {Integer} result_id
   *         The id of the result in the database.
   * @return {Array}
   *         The return value of parseResults:
   *         An object: {quizData, sessionData}, wrapped in an array.
   *         quizData: {
   *             id
   *             author_id
   *             title
   *             description
   *             category_id
   *          }
   *         sessionData: {
   *            id
   *            user_id
   *            username
   *            duration
   *            end_time
   *            correct_answers
   *            responses: [
   *                      {question,
   *                       answer,
   *                       actual_answer}
   *                        ]
   *          }
   *
   */
  getResults: function(result_id) {
    const queryString = `
      SELECT DISTINCT username,
        user_id,
        quizzes.id AS quiz_id,
        author_id,
        title,
        description,
        category_id,
        sessions.id AS session_id,
        start_time,
        end_time,
        questions.id AS question_id,
        questions.body AS question,
        difficulty,
        session_answers.answer_id AS chosen_answer,
        answers.body AS answer,
        answers.id AS answer_id,
        is_correct
      FROM results
        JOIN quiz_sessions AS sessions ON results.session_id = sessions.id
        LEFT OUTER JOIN users ON sessions.user_id = users.id
        JOIN quizzes ON sessions.quiz_id = quizzes.id
        JOIN questions ON quizzes.id = questions.quiz_id
        JOIN answers ON answers.question_id = questions.id
        FULL OUTER JOIN session_answers ON sessions.id = session_answers.session_id
                             AND (session_answers.answer_id = answers.id)
      WHERE results.id = $1
      ORDER BY questions.id;
    `;
    const queryParams = [result_id];
    return db.query(queryString, queryParams)
      .then(rows => parseResults(rows))
      .catch(err => console.log(err));
  }

};