const db = require("./db");

module.exports = {
  /**
   * Adds a new quiz to the database. Also adds all included questions and answers.
   * @param  { { author_id: int, 
   *             category_id: int,
   *             title: string,
   *             description: string,
   *             public: boolean,
   *             questions: array } } quiz
   *         The quiz data to be added.
   * @return {Promise<{}>}
   *         A promise to the quiz.
   */
  addQuiz: function(quizData) {
    // Separate the quiz metadata from the questions
    const questions = quizData.questions;
    delete quizData.questions;
    console.log("Quiz data:", quizData);
    console.log("Questions: ", questions);
    // Extract the user data into queryParams and the keys into an array
    const {columns, vars, queryParams} = db.buildInsertQueryParams(quizData);
    const queryString = `
      INSERT INTO quizzes (${columns})
      VALUES (${vars})
      RETURNING *;
    `;
    return db.query(queryString, queryParams)
    .then(rows => {
      // Save the quiz object
      const quiz = rows[0];
      // Create the array to hold all the promises from adding each question
      // The quiz object is the first thing in this array, so we can access it later
      const questionPromises = [quiz];
      // Add the quiz id to each question and add its database promise to the array
      for (let question of questions) {
        question['quiz_id'] = quiz.id;
        questionPromises.push(this.addQuestion(question));
      }
      // Return once all have resolved
      return Promise.all(questionPromises);
    })
    .then(promiseArr => {
      console.log(promiseArr);
      // The quiz is still the first element in the array, so we return that
      return promiseArr[0];
    })
    .catch(err => console.error(err));
  },

  /**
   * Adds a new question to the database.
   * @param  { { quiz_id: int, 
   *             body: int,
   *             answers: array,
   *             difficulty: string } } quiz
   *         The question data to be added.
   * @return {Promise<{}>}
   *         A promise to the question.
   */
  addQuestion: function(questionData) {
    // Separate the answers from the question
    const answers = questionData.answers;
    delete questionData.answers;
    // Extract the user data into queryParams and the keys into an array
    const {columns, vars, queryParams} = db.buildInsertQueryParams(questionData);
    const queryString = `
      INSERT INTO questions (${columns})
      VALUES (${vars})
      RETURNING *;
    `;
    return db.query(queryString, queryParams)
    .then(rows => rows[0]);
  },

  /**
   * Adds a new answer to the database.
   * @param  { { question_id: int, 
     *             body: string,
     *             is_correct: boolean,
     *             explanation: string } } quiz
     *         The answer data to be added.
     * @return {Promise<{}>}
     *         A promise to the answer.
     */
  addAnswer: (answerData) => {
    // Extract the user data into queryParams and the keys into an array
    const {columns, vars, queryParams} = db.buildInsertQueryParams(answerData);
    const queryString = `
      INSERT INTO quizzes (${columns})
      VALUES (${vars})
      RETURNING *;
    `;
    return db.query(queryString, queryParams)
    .then(rows => rows[0]);
  }
};