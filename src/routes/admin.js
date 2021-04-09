const express = require("express");
const router = express.Router();

module.exports = (db) => {

  // /admin/:keyid
  // Seeds the database from the client-side
  router.post("/:keyID", (req, res) => {
    // Browse all
    // Get all quizzes (this is where we'd add a sort parameter in the future)
    const {
      userData,
    } = res.locals.vars;

    // Check that the user is an admin

    if (!userData.is_admin) {
      req.flash("danger", "You don't have permission to do that!");
      res.redirect("/home");
    } else {
      const quizData = JSON.stringify(require("../db/client/quizzes.json"));
      const key = req.params.keyID;
      const quiz = JSON.parse(quizData)[key];
      db.addQuiz(quiz)
        .then(rows => {
          // addQuiz returns an array of promises to all the quiz/question/answer data, but the quiz itself is the first element
          const quizData = rows[0];
          req.flash("success", "ADMIN: Quiz created successfully!");
          res.redirect(`/quizzes/${quizData.id}`);
        })
        .catch(err => console.error(err));
    }
  });

  return router;

};