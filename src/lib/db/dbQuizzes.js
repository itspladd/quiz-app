const db = require("./db");

module.exports = {

  /**
   * Search for quizzes that match the input parameters.
   * @param  { searchParameters: {  } } quiz
   *         The quiz data to be added.
   * @return {Promise<{}>}
   *         A promise to the quiz.
   */
  getPublicQuizzes: function(searchParameters) {
    let queryString = `
      SELECT quizzes.*, 
        users.username AS author,
        ROUND( AVG(rating), 1 ) as avg_rating
      FROM quizzes
        JOIN users ON author_id = users.id
        RIGHT OUTER JOIN quiz_ratings AS ratings ON ratings.quiz_id = quizzes.id 
      WHERE public = TRUE 
    `;

    // Add grouping and filtering
    queryString += `
    GROUP BY quizzes.id, users.id
    `
    const queryParams = [];
    // Close out the query
    queryString += `;`;
    return db.query(queryString, queryParams);
  },

  getQuizByID: function(id) {
    const queryString = `
      SELECT quizzes.*,
        users.username AS author
      FROM quizzes
        JOIN users ON users.id = quizzes.id
      WHERE quizzes.id = $1;
    `;
    const queryParams = [id];
    return db.query(queryString, queryParams)
    .then(rows => rows[0]);
  },

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
    // Mark the first answer as correct
    answers[0].is_correct = true;

    delete questionData.answers;

    // Extract the question data into queryParams and the keys into an array
    const {columns, vars, queryParams} = db.buildInsertQueryParams(questionData);
    const queryString = `
      INSERT INTO questions (${columns})
      VALUES (${vars})
      RETURNING *;
    `;

    // Return a promise to the query completion, value is the question object
    return db.query(queryString, queryParams)
    .then(rows => {
      // Save the question object
      const question = rows[0];
      // Create the array to hold all the promises from adding each answer
      // The question object is the first thing in this array, so we can access it later
      const answerPromises = [question];
      // Add the question id to each answer and add its database promise to the array
      for (let answer of answers) {
        answer['question_id'] = question.id;
        answerPromises.push(this.addAnswer(answer));
      }
      // Return once all have resolved
      return Promise.all(answerPromises);
    })
    .then(promiseArr => {
      // The question is still the first element in the array, so we return that
      return promiseArr[0];
    })
    .catch(err => console.error(err));
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
  addAnswer: function(answerData) {
    // Extract the answer data into queryParams and the keys into an array
    const {columns, vars, queryParams} = db.buildInsertQueryParams(answerData);
    const queryString = `
      INSERT INTO answers (${columns})
      VALUES (${vars})
      RETURNING *;
    `;
    return db.query(queryString, queryParams)
    .then(rows => rows[0])
    .catch(err => console.error(err));
  }
};