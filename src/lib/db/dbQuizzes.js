const db = require("./db");

module.exports = {
  /**
   * Adds a new quiz to the database.
   * @param  { { author_id: int, 
   *             category_id: int,
   *             title: string
   *             description: string
   *             public: boolean } } quiz
   *         The quiz data to be added.
   * @return {Promise<{}>}
   *         A promise to the quiz.
   */
  addQuiz: (quizData) => {
    // Extract the user data into queryParams and the keys into an array
    const {columns, vars, queryParams} = db.buildInsertQueryParams(quizData);
    const queryString = `
      INSERT INTO quizzes (${columns})
      VALUES (${vars})
      RETURNING *;
    `;
    return db.query(queryString, queryParams)
    .then(rows => rows[0]);
  }
};