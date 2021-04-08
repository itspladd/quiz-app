const db = require("./db");

/**
 * Parse the information from getQuizQuestionsAndAnswers into an object consumable by the front-end.
 * @param  {Array} rows
 *         The raw data from the database, containing duplicates of the question data and unique instances of answer data.
 * @return {Array}
 *         An array of question data in the following format:
 *          [
 *           { id, quiz_id, body, difficulty, answers: [ { id, question_id, body, is_correct }, ...] },
 *            ...
 *          ]
 */
const parseQuestionData = (rows, quiz_id) => {

  const questionData = [];

  // Initialize to the first question and array counter
  let currentQuestionID = null;
  let index = -1;

  // Every row contains *unique* answer data and *duplicated* question data.
  // Thus, this loop tracks the current question and position in the questionData index.
  // It adds a single entry to the questionData[] array for each unique question,
  // and adds an entry to the appropriate answers[] array for each row.
  for (let row of rows) {
    // If we're on a new question...
    if (row.question_id !== currentQuestionID) {
      // Add the question and init the answer array
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
    // Store answer data
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
   * Return all publicly-listed, active quizzes.
   * @return {Promise<{}>}
   *         A promise to an array of quizzes with additional category title, quiz author, and cover photo data.
   */
  getPublicQuizzes: function() {
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
    return db.query(queryString, queryParams);
  },

  /**
   * Return the top 7 highest-average-rating quizzes.
   * @return {Promise<{}>}
   *         A promise to an array of no more than 7 quizzes, including total quiz plays and average rating for each.
   */
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

  /**
   * Return 3 public, active quizzes marked as 'featured' in the DB.
   * @return {Promise<{}>}
   *         A promise to an array of no more than 3 quizzes, including category title, cover photo, author ID, and member status of author (i.e. admin or normal user)
   */
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

  /**
   * The God Query.
   * Return data about a single active quiz, including the current user's history with this quiz.
   * @param  {Object} params 
   *         An object containing user_id and quiz_id, where user_id is the currently logged-in user or NULL for anonymous users
   * @return {Promise<{}>}
   *         A promise to an array containing 1 object containing:
   *         - All standard quiz data
   *         - Title of the quiz's category
   *         - Author ID and admin status of author
   *         - Cover photo URL (defaults to the category cover photo if none is specified for this quiz)
   *         - Average score for all users who have taken this quiz, as an integer representing percentage (i.e. 50 indicates 50% score)
   *         - Number of questions in the quiz
   *         - Total number of times this quiz has been played
   *         - Average review score for this quiz
   *         - Whether the current user has taken this quiz before, as a TRUE or FALSE value
   *         - Whether the current user has favorited this quiz
   */
  getQuizByID: function(params) {
    const {quiz_id, user_id} = params;
    
    // Note the OUTER joins - without them, we can only retrieve quizzes that have already been played and/or reviewed.
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

  /**
   * 
   * Return data about a single active quiz, including the current user's history with this quiz.
   * @param  {Object} params 
   *         An object containing user_id and quiz_id, where user_id is the currently logged-in user or NULL for anonymous users
   * @return {Promise<{}>}
   *         A promise to an array containing 1 object containing:
   *         - All standard quiz data
   *         - Title of the quiz's category
   *         - Author ID and admin status of author
   *         - Cover photo URL (defaults to the category cover photo if none is specified for this quiz)
   *         - Average score for all users who have taken this quiz, as an integer representing percentage (i.e. 50 indicates 50% score)
   *         - Number of questions in the quiz
   *         - Total number of times this quiz has been played
   *         - Average review score for this quiz
   *         - Whether the current user has taken this quiz before, as a TRUE or FALSE value
   *         - Whether the current user has favorited this quiz
   */
  getQuizzesForUser: function(userID) {
    const queryString = `
      SELECT quizzes.*,
        categories.title AS category_title,
          (CASE
            WHEN quizzes.coverphoto_url IS NULL
            THEN categories.coverphoto_url END)
        AS coverphoto_url
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

  /**
   * 
   * Return question and answer data for a single quiz.
   * NOTE: Uses the parseQuestionData helper function to format data.
   * @param  {Integer} quiz_id 
   *         The id of the quiz.
   * @return {Array}
   *         An array containing each question as an object in the following format:
   *           { 
   *            id, 
   *            quiz_id, 
   *            body, 
   *            difficulty, 
   *            answers: [ 
   *              { id, question_id, body, is_correct }, 
   *              { id, question_id, body, is_correct }, etc
   *            ]
   *           }
   */
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
   * Adds a new quiz to the database.
   * Also adds all included questions and answers 
   * by calling the addQuestion and addAnswer functions.
   * @param  { { author_id: int,
   *             category_id: int,
   *             title: string,
   *             description: string,
   *             public: boolean,
   *             questions: array } } quizData
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
        // The quiz object itself is the first element of this array
        // Why? So that when we exit this function, the function that called this one
        // has access to the quiz data.
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

  /**
   * Toggles a quiz as public or unlisted.
   * @param  { Integer } quiz_id
   *         The ID of the quiz.
   * @return {Promise<{}>}
   *         A promise to a boolean indicating the new status of the quiz.
   */
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

  /**
   * Toggles a quiz as featured or not featured.
   * @param  { Integer } quiz_id
   *         The ID of the quiz.
   * @return {Promise<{}>}
   *         A promise to a boolean indicating the new status of the quiz.
   */
  toggleQuizFeatured: function(quiz_id) {
    const queryString = `
    UPDATE quizzes
    SET featured = NOT featured
    WHERE id = $1
    RETURNING featured
    `;
    const queryParams = [quiz_id];
    return db.query(queryString, queryParams);
  },

  /**
   * Toggles a quiz as active or inactive ("deleted").
   * @param  { Integer } quiz_id
   *         The ID of the quiz.
   * @return {Promise<{}>}
   *         A promise to a boolean indicating the new status of the quiz.
   */
  toggleQuizActive: function(quiz_id) {
    const queryString = `
    UPDATE quizzes
    SET active = NOT active
    WHERE id = $1
    `;
    const queryParams = [quiz_id];
    return db.query(queryString, queryParams);
  },

  /**
   * Returns the author of a given quiz.
   * @param  { Integer } quiz_id
   *         The ID of the quiz.
   * @return {Promise<{}>}
   *         A promise to the author ID.
   */
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
