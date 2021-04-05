const e = require("express");
const express = require("express");
const router = express.Router();

module.exports = (db) => {

  // /quizzes
  router.get("/", (req, res) => {
    // Browse all
    // Get all quizzes (this is where we'd add a sort parameter in the future)
    const {
      alerts,
      userData,
      currentPage,
      rankData
    } = res.locals.vars;

    db.getPublicQuizzes()
      .then(quizData => {
        const templateVars = {
          alerts,
          userData,
          currentPage,
          quizData,
          rankData
        };
        res.render("quiz_index", templateVars);
      })
      .catch(err => console.error(err));
  });

  // /quizzes/new
  router.get("/new", (req, res) => {
    const {
      alerts,
      userData,
      currentPage,
      rankData
    } = res.locals.vars;
    // ERROR: User is not logged in
    if (!userData) {
      req.flash("warning", "You must be logged in to do that!");
      res.redirect("/login");
      // SUCCESS: User is logged in
    } else {
      const templateVars = {
        alerts,
        userData,
        currentPage,
        rankData
      };
      res.render("quiz_new", templateVars);
    }
  });

  // /quizzes/:quizID --> generates a session and results/:sessionID on the client-side
  router.get("/:quizID", (req, res) => {
    const {
      alerts,
      userData,
      currentPage,
      rankData
    } = res.locals.vars;
    db.getQuizByID(req.params.quizID)
      .then(quizData => {
        // ERROR: Invalid quizID
        if (!quizData) {
          res.redirect("/404");
        } else {

          // TEMPORARY REVIEWS ///////////////

          const reviews = [
            { user_id: 1, username: "reggi", comment: "this quiz sucks", rating: "1" },
            { user_id: 2, username: "francis", comment: "this quiz depends", rating: "3" },
            { user_id: 3, username: "pladd", comment: "this quiz is awesome", rating: "5" }
          ]

          quizData.reviews = reviews;

          ////////////////////////////////////

          const templateVars = {
            alerts,
            userData,
            currentPage,
            rankData,
            quizData
          };
          res.render("quiz_show", templateVars);
        }
      })
      .catch(err => console.error(err));
  });

  // Create a new quiz
  // Restrictions: user must be logged in
  router.post("/", (req, res) => {
    // This is what is received from the form's post request:
    console.log("From the POST request...");
    console.log(req.body);

    const {
      userData
    } = res.locals.vars;

    // After the form data is received...

    // 1. Check that the user is signed in
    // ERROR: User is not logged in
    if (userData === null) {
      console.log("You must be logged in to do that.");
      req.flash("warning", "You must be logged in to do that.");
      res.redirect("/login");
      // SUCCESS: User is logged in
    } else if (userData) {

      // 2. Validate the form data and ensure that all table column values are present & of the right type
      // Helper function: validateFormBody(req.body) => true or false;
      const valid = true;

      // 3. Construct the quiz variable to contain everything that db.addQuiz() needs
      if (valid) {
        const quiz = req.body;
        quiz.author_id = userData.id;
        // After quiz is constructed with all of the values it needs, pass it into db.addQuiz();
        db.addQuiz(quiz)
          .then(quiz => {
            req.flash("success", "Quiz created successfully!");
            res.json(quiz.id);
          })
          .catch(err => console.log(err));
      }
    }

  });

  // Start a new quiz session
  // Restrictions: none
  // NOTE: Users do NOT need to be logged in to start a quiz. This means that a quiz_session should
  // be generated, except user_id would be null, and no post-quiz data will be received by the server
  // (no results or session_answers).
  // LATER: If we want to, we can track anonymous quiz plays by counting sessions with user_id = null
  router.post("/:quizID/sessions", (req, res) => {

    // return res.send(false);

    // TEMPORARY IN-MEMORY DATA ////////////////////////////////////

    const tempData = {
      sessionID: 1337,
      questions: [
        // QUESTION #1 /////////////////////////////////////////
        {
          question: { id: 1, quiz_id: 1, body: "What is the capital of Canada?", difficulty: 1 },
          answers: [
            { id: 1, question_id: 1, body: "Ottawa", is_correct: true, explanation: "why tho D:" },
            { id: 2, question_id: 1, body: "Wrong1", is_correct: false, explanation: "why tho" },
            { id: 3, question_id: 1, body: "Wrong2", is_correct: false, explanation: "why thooo" },
            { id: 4, question_id: 1, body: "Wrong3", is_correct: false, explanation: "why tho bro" },
          ]
        },
        // QUESTION #2 ///////////////////////////////////////////
        {
          question: { id: 2, quiz_id: 1, body: "What is the capital of the US?", difficulty: 2 },
          answers: [
            { id: 5, question_id: 2, body: "Washington, D.C.", is_correct: true, explanation: "why tho D:" },
            { id: 6, question_id: 2, body: "Wrong1", is_correct: false, explanation: "because" },
            { id: 7, question_id: 2, body: "Wrong2", is_correct: false, explanation: "why thoooooo" },
            { id: 8, question_id: 2, body: "Wrong3", is_correct: false, explanation: "but WHY tho" },
          ]
        },
      ]
    }

    res.send(JSON.stringify(tempData));
    return;

    // END OF TEMPORARY IN-MEMORY DATA //////////////////////////////


    const {
      userData
    } = res.locals.vars;
    const quiz_id = req.params.quizID;
    const user_id = userData ? userData.id : null;
    // Instead of getting questions and answers separately, run a query to get all of the questions and answers of a quiz in one shot to avoid needing to chain additional promises
    // COLUMNS TO SELECT: questions.id, questions.quiz_id, questions.body, questions.difficulty, answers.id, answers.question_id, answers.body, answers.is_correct, answers.explanation
    // The table will have 4 rows per question (due to having multiple answers), then just reconstruct it into the quizData format below:
    /*
    data.questions: [
      // QUESTION #1 /////////////////////////////////////////
      {
        question: { id, quiz_id, body, difficulty },
        answers: [
          { id, question_id, body, is_correct, explanation },
          { id, question_id, body, is_correct, explanation },
          { id, question_id, body, is_correct, explanation },
          { id, question_id, body, is_correct, explanation },
        ]
      },
      // QUESTION #2 ///////////////////////////////////////////
      {
        question: { id, quiz_id, body, difficulty },
        answers: [
          { id, question_id, body, is_correct, explanation },
          { id, question_id, body, is_correct, explanation },
          { id, question_id, body, is_correct, explanation },
          { id, question_id, body, is_correct, explanation },
        ]
      },
    ]
    */
    db.getQandAByQuizID({quiz_id})
      .then(questionsAndAnswersData => {

        // If there's no data, it means quiz_id was invalid and there were no Q's and A's
        // check this: i'm not sure what the value would be - if the quiz id doesn't exist the condition would be if length = 0?
        // Just make sure this redirect goes through if no data is received
        if (!questionsAndAnswersData) {
          res.redirect("/404");

          // If the quiz exists and its questions/answers were retrieved successfully...
        } else {

          // Reconstruct questionsAndAnswersData into the format above and insert into data
          const data = {
            questions
          }

          // I *think* it's not necessary to send the actual quiz data (from the quizzes table) again since this POST request
          // is sent via AJAX meaning the user is still on the /quizzes/:quizid page which already has that stuff
          // If anything, just grab quizData again and add it to data.quizData = quizData, but we shouldn't need to

          // Create a new entry in the quiz_sessions table
          db.addSession({quiz_id, user_id})
            .then(session => {
              console.log(`New session started by ${userData.username || "anonymous"}!`);
              // On successful session creation, respond to the user's PLAY QUIZ ajax post request with JSON data
              // containing all of a quiz's questions and answers
              // question => a row from the questions table connected to
              // answers => the 4 rows from the answers table

              // Add the sessionID to the quizData object
              data.sessionID = session.id;

              // Send all of the data back to the client as a JSON
              res.send(JSON.stringify(data));
            })
            .catch(err => console.log(err));

        }
      })
  });

  /*STRETCH: global results from this quiz
    router.get("/:quizID/results", (req, res) => {
    res.render("quiz_results");
  });
 */

  return router;
};