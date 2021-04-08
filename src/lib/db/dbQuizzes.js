const db = require("./db");

// Helper function for getQuizQuestionsAndAnswers
const parseQuestionData = (rows, quiz_id) => {

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
      is_correct: row.answer_is_correct
    });

  }
  return questionData;
};

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
        categories.title AS category_title,
        users.username AS author,
          (CASE
            WHEN quizzes.coverphoto_url IS NULL
            THEN categories.coverphoto_url END)
        AS coverphoto_url
        FROM quizzes
        JOIN users ON author_id = users.id
        JOIN categories ON category_id = categories.id
      WHERE public = TRUE
        AND active
    `;
    const queryParams = [];
    // Close out the query
    queryString += ";";
    return db.query(queryString, queryParams);
  },

  getTrendingQuizzes: function() {
    let queryString = `
      SELECT quizzes.*,
        COUNT(DISTINCT quiz_sessions.*) AS total_plays,
        ROUND(AVG(rating), 1) AS average_rating
      FROM quizzes
        JOIN quiz_sessions ON quizzes.id = quiz_sessions.quiz_id
        JOIN quiz_reviews ON quizzes.id = quiz_reviews.quiz_id
      WHERE public = TRUE
        AND active
      GROUP BY quizzes.id
      ORDER BY AVG(rating) DESC
      LIMIT 7
    `;
    return db.query(queryString, []);
  },

  getFeaturedQuizzes: function() {
    let queryString = `
    SELECT quizzes.*,
    categories.title AS category_title,
    users.username AS author,
    users.is_admin AS is_admin,
      (CASE
        WHEN quizzes.coverphoto_url IS NULL
        THEN categories.coverphoto_url END)
    AS coverphoto_url
    FROM quizzes
      JOIN users ON author_id = users.id
      JOIN categories ON category_id = categories.id
    WHERE public = TRUE
      AND active
      AND featured = TRUE
    LIMIT 3
    `;
    return db.query(queryString, []);
  },

  // From Reggi: in case anything breaks, I added the lines "users.is_admin AS is_admin", and "users.is_admin" to the GROUP BY clause
  getQuizByID: function(params) {
    const {quiz_id, user_id} = params;
    const queryString = `
      SELECT quizzes.*,
        categories.title AS category_title,
        users.is_admin AS is_admin,
        users.username AS author,
          (CASE
            WHEN quizzes.coverphoto_url IS NULL
            THEN categories.coverphoto_url END)
        AS coverphoto_url,
          ROUND(
            ( COUNT(CASE WHEN answers.is_correct THEN answers.is_correct END)::numeric
            / COUNT(*)::numeric )
            * 100)::integer
        AS score,
          (SELECT COUNT(*)
            FROM questions
            JOIN quizzes
            ON quizzes.id = questions.quiz_id
            WHERE quizzes.id = $1)
        AS num_questions,
          (SELECT COUNT(*)
            FROM quiz_sessions
            JOIN quizzes ON quiz_sessions.quiz_id = quizzes.id
            WHERE quizzes.id = $1)
        AS total_plays,
          ROUND(
            (SELECT AVG(rating)
            FROM quiz_reviews
              JOIN quizzes ON quizzes.id = quiz_reviews.quiz_id
            WHERE quiz_id = $1), 1)
        AS average_rating,
          (SELECT 
            (CASE
              WHEN COUNT(*) = 0 THEN FALSE
              ELSE TRUE
            END)
          FROM quiz_sessions
          JOIN quizzes ON quiz_sessions.quiz_id = quizzes.id
          WHERE quiz_sessions.quiz_id = $1
            AND quiz_sessions.user_id = $2)
        AS already_played,
          (SELECT
            (CASE
              WHEN COUNT(*) = 0 THEN FALSE
              ELSE TRUE
            END)
          FROM favorites
            WHERE favorites.quiz_id = $1
            AND favorites.user_id = $2)
        AS is_favorited
      FROM quizzes
        FULL OUTER JOIN quiz_sessions AS sessions ON sessions.quiz_id = quizzes.id
        JOIN questions ON questions.quiz_id = quizzes.id
        FULL OUTER JOIN session_answers ON sessions.id = session_answers.session_id
        FULL OUTER JOIN answers ON session_answers.answer_id = answers.id
        JOIN categories ON category_id = categories.id
        JOIN users ON users.id = author_id
      WHERE quizzes.id = $1
        AND active
      GROUP BY quizzes.id, categories.id, users.username, users.is_admin
      ORDER BY creation_time DESC;
    `;
    const queryParams = [quiz_id, user_id];
    return db.query(queryString, queryParams);
  },

  getQuizzesForUser: function(userID) {
    const queryString = `
      SELECT quizzes.*,
        categories.title AS category_title
      FROM quizzes
        JOIN categories ON category_id = categories.id
        JOIN users ON users.id = author_id
      WHERE author_id = $1
        AND active
      ORDER BY creation_time DESC;
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
        answers.is_correct AS answer_is_correct
      FROM questions
        JOIN answers ON answers.question_id = questions.id
        JOIN quizzes ON questions.quiz_id = quizzes.id
      WHERE quiz_id = $1
        AND quizzes.active
      ORDER BY question_id;
    `;
    const queryParams = [quiz_id];
    return db.query(queryString, queryParams)
      .then(rows => {
        return parseQuestionData(rows, quiz_id);
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
          questionPromises.push(this.addQuestion(question)[0]);
        }
        // Return once all have resolved
        return Promise.all(questionPromises);
      });
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
          answerPromises.push(this.addAnswer(answer)[0]);
        }
        // Return once all have resolved
        return Promise.all(answerPromises);
      });
  },

  /**
   * Adds a new answer to the database.
   * @param  { { question_id: int,
   *             body: string,
   *             is_correct: boolean } } quiz
   *         The answer data to be added.
   * @return {Promise<{}>}
   *         A promise to the answer.
   */
  addAnswer: function(answerData) {
    // Extract the answer data into queryParams and the keys into an array

    return db.insert("answers", answerData);
  },

  toggleQuizPublic: function(quiz_id) {
    const queryString = `
    UPDATE quizzes
    SET public = NOT public
    WHERE id = $1
    RETURNING public
    `;
    const queryParams = [quiz_id];
    return db.query(queryString, queryParams);
  },

  toggleQuizFeature: function(quiz_id) {
    const queryString = `
    UPDATE quizzes
    SET featured = NOT featured
    WHERE id = $1
    RETURNING featured
    `;
    const queryParams = [quiz_id];
    return db.query(queryString, queryParams);
  },

  toggleQuizActive: function(quiz_id) {
    const queryString = `
    UPDATE quizzes
    SET active = NOT active
    WHERE id = $1
    `;
    const queryParams = [quiz_id];
    return db.query(queryString, queryParams);
  },

  getQuizAuthor: function(quiz_id) {
    const queryString = `
    SELECT author_id
    FROM quizzes
    WHERE id = $1
    `;
    const queryParams = [quiz_id];
    return db.query(queryString, queryParams);
  },
};
