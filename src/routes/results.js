/* eslint-disable */

const express = require("express");
const router = express.Router();

module.exports = (db) => {

  // After the quiz has ended, the client sends the following data to PUT: "/:quizID/sessions/:sessionID" :
  //  { session_id, answers }
  //   -- (answers is an array of answerIDs)
  // Server uses this data to store the session_answers, update the quiz_session end_time and create a results table entry
  // Server should send back a result ID which is used to REDIRECT the client to the results page on the client side
  //   -- Redirect to GET route: /results/:resultID


  // /results/:resultID
  router.get("/:resultID", (req, res) => {
    const {
      alerts,
      userData,
      currentPage,
      rankData
    } = res.locals.vars;
    const user_id = userData ? userData.id : null;
    let resultData, sessionData, quizData;
    db.getResults(req.params.resultID)
      .then(rows => {
        resultData = rows[0];
        quizData = resultData.quizData;
        sessionData = resultData.sessionData;
        return db.isQuizFavoritedByUser(user_id, quizData.id);
      })
      .then(rows => {
        quizData.is_favorited = (rows.length > 0);
        const templateVars = {
          alerts,
          userData,
          currentPage,
          rankData,
          quizData,
          sessionData
        };
        res.render("quiz_results", templateVars);
      })
      .catch(err => {
        console.error(err);
        req.flash("danger", "Either the URL you entered is invalid or that page is no longer available.");
        res.redirect("/404");
      });
  });

  return router;

};