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
    // POST STUFF
    // REDIRECT TO /:quizID
    // Make sure quiz data is in this format:
    /* {
      author_id,
      category_id,
      title,
      description,
      public,
      questions: [
        {
          body
          difficulty (optional)
          answers: [
            body,
            is_correct,
            explanation (optional)
          ]
        }
      ]
    }
    */
    db.addQuiz(quiz)
    .then(quiz => res.redirect(`/quizzes/${quiz.id}`))
    .catch(err => console.log(err));
  });

  /*STRETCH: global results from this quiz
    router.get("/:quizID/results", (req, res) => {
    res.render("quiz_results");
  });
 */

  return router;
};