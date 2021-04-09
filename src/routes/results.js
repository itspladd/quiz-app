/* eslint-disable */

const express = require("express");
const router = express.Router();

module.exports = (db) => {

  // Results page for a quiz session
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