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
    const templateVars = {
      alerts,
      userData,
      currentPage,
      rankData
    };
    res.render("quiz_new", templateVars);
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
      const templateVars = {
        alerts,
        userData,
        currentPage,
        rankData,
        quizData
      };
      res.render("quiz_show", templateVars);
    })
    .catch(err => console.error(err));
  });

  router.post("/", (req, res) => {
    // This is what is received from the form's post request:
    console.log("From the POST request...");
    console.log(req.body);

    const {
      userData
    } = res.locals.vars;

    console.log(userData)

    // After the form data is received...

    // 1. Check that the user is signed in
    // ERROR: The user is not signed in
    if (userData === null) {
      console.log("You must be logged in to do that.");
      req.flash("warning", "You must be logged in to do that.")
      res.redirect("/login");
      // SUCCESS: The user is signed in
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
    /*
    const quiz = {
      author_id,
      title,
      description,
      category_id,
      public,
      questions: [
        {
          body: "What is the capital of Canada?",
          answers: [
            { body: "ans1", explanation: "why tho" },
            { body: "ans2", explanation: "why tho" },
            { body: "ans3", explanation: "why tho" },
            { body: "ans4", explanation: "why tho" }
          ]
        },
        {
          question: "What is the capital of Canada?",
          answers: [
            { body: "ans1", explanation: "why tho" },
            { body: "ans2", explanation: "why tho" },
            { body: "ans3", explanation: "why tho" },
            { body: "ans4", explanation: "why tho" }
          ]
        }
      ]
    }
    */

  });

  /*STRETCH: global results from this quiz
    router.get("/:quizID/results", (req, res) => {
    res.render("quiz_results");
  });
 */

  return router;
};