const db = require("./db");

module.exports = {
  /**
   * Adds a new quiz to the database.
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
  addQuiz: (quizData) => {
    // 

    // Extract the user data into queryParams and the keys into an array
    const {columns, vars, queryParams} = db.buildInsertQueryParams(quizData);
    const queryString = `
      INSERT INTO quizzes (${columns})
      VALUES (${vars})
      RETURNING *;
    `;
    return db.query(queryString, queryParams)
    .then(rows => rows[0]);
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
  addQuestion: (questionData) => {
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