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
        users.username AS author
        FROM quizzes
        JOIN users ON author_id = users.id
      WHERE public = TRUE
    `;
    const queryParams = [];
    // Close out the query
    queryString += ";";
    return db.query(queryString, queryParams);
  },

  getQuizByID: function(id) {
    const queryString = `
      SELECT quizzes.*,
        users.username AS author
      FROM quizzes
        JOIN users ON users.id = author_id
      WHERE quizzes.id = $1;
    `;
    const queryParams = [id];
    return db.query(queryString, queryParams)
      .then(rows => rows[0]);
  },

  getQuizzesForUser: function(userID) {
    const queryString = `
      SELECT quizzes.*
      FROM quizzes
      JOIN users ON users.id = author_id
      WHERE author_id = $1
      ORDER BY creation_date DESC;
    `;
    const queryParams = [userID];
    return db.query(queryString, queryParams);
  },

  getQuizQuestionsAndAnswers: function(quiz_id) {
    const queryString = `
      SELECT questions.id AS question_id,
        questions.body AS question_body,
        questions.difficulty AS question_difficulty,
        answers.id AS answer_id,
        answers.question_id AS answer_question_id,
        answers.body AS answer_body,
        answers.is_correct AS answer_is_correct,
        answers.explanation AS answer_explanation
      FROM questions
        JOIN answers ON answers.question_id = questions.id
      WHERE quiz_id = $1
      ORDER BY question_id;
    `;
    const queryParams = [quiz_id];
    return db.query(queryString, queryParams)
      .then(rows => {
        // Organize the data into the necessary structure, as follows:
        /* questionData: [
          {
            question: {//question info here},
            answers: [
              {answer1 data},
              {answer2 data}
            ]},
          {
            question... },
        ]
        */
        const questionData = [];

        // Initialize to the first question and array counter
        let currentQuestionID = null;
        let index = -1;
        for (let row of rows) {
          // If we're on a new question...
          if (row.question_id !== currentQuestionID) {
            // Add the question and start the answer array
            currentQuestionID = row.question_id;
            questionData.push({
              question: {
                id: row.question_id,
                quiz_id,
                body: row.question_body,
                difficulty: row.question_difficulty
              },
              answers: []
            });
            // Increment counter so we know where to store our answers
            index++;
          }
          // Store answers
          questionData[index].answers.push({
            id: row.answer_id,
            question_id: row.answer_question_id,
            body: row.answer_body,
            is_correct: row.answer_is_correct,
            explanation: row.answer_explanation
          });

        };
        return questionData;
      });
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
    return db.insert("quizzes", quizData)
      .then(rows => {
        // Save the quiz object
        const quiz = rows[0];
        // Create the array to hold all the promises from adding each question
        // The quiz object is the first thing in this array, so we can access it later
        const questionPromises = [quiz];
        // Add the quiz id to each question and add its database promise to the array
        for (let question of questions) {
          question["quiz_id"] = quiz.id;
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

    // Return a promise to the query completion, value is the question object
    return db.insert("questions", questionData)
      .then(rows => {
        // Save the question object
        const question = rows[0];
        // Create the array to hold all the promises from adding each answer
        // The question object is the first thing in this array, so we can access it later
        const answerPromises = [question];
        // Add the question id to each answer and add its database promise to the array
        for (let answer of answers) {
          answer["question_id"] = question.id;
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

    return db.insert("answers", answerData)
      .then(rows => rows[0])
      .catch(err => console.error(err));
  }

};