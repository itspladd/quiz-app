const db = require("./db");
const {
  response
} = require("express");

module.exports = {

  getResults: function(result_id) {
    const queryString = `
      SELECT username,
        user_id,
        quizzes.id AS quiz_id,
        author_id,
        title,
        description,
        category_id,
        sessions.id AS session_id,
        start_time,
        end_time,
        questions.body AS question,
        difficulty,
        answers.body AS answer,
        is_correct
      FROM results
        JOIN quiz_sessions AS sessions ON results.session_id = sessions.id
        JOIN users ON sessions.user_id = users.id
        JOIN quizzes ON sessions.quiz_id = quizzes.id
        JOIN session_answers ON sessions.id = session_answers.session_id
        JOIN answers ON answers.id = session_answers.answer_id
        JOIN questions ON answers.question_id = questions.id
      WHERE results.id = $1
    `;
    const queryParams = [result_id];
    return db.query(queryString, queryParams)
      .then(rows => {
        singletonRow = rows[0];
        const userData = {
          id: singletonRow.user_id,
          username: singletonRow.username
        };
        const quizData = {
          id: singletonRow.quiz_id,
          author_id: singletonRow.author_id,
          title: singletonRow.title,
          description: singletonRow.description,
          category_id: singletonRow.category_id
        };

        const responses = [];
        for (let row of rows) {
          const question = row.question;
          let {
            answer,
            is_correct
          } = row;
          answer = {
            answer,
            is_correct
          };
          const response = {
            question,
            answer
          };
          responses.push(response);
        }

        const sessionData = {
          id: singletonRow.session_id,
          start_time: singletonRow.start_time,
          end_time: singletonRow.end_time,
          responses
        };
        return {
          userData,
          quizData,
          sessionData
        };
      });
  }

};