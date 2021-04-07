const express = require("express");
const { isQuizFavoritedByUser } = require("../lib/db/dbFavorites");
const router = express.Router();

module.exports = (db) => {

  // After the quiz has ended, the client sends the following data to the server via a PUT request on route :
  //  {end_time, session_id, answers}
  //   -- (answers is an array of answerIDs)
  // Server uses this data to store the session_answers, update the quiz_session end_time and create a results table entry
  // Server should send back a result ID which is used to REDIRECT the client to the results page on the client side
  //   -- Redirect to GET route: /results/:resultID

  // NEW GET ROUTE FOR "results": Given a resultID, the results page should receive the following data from templateVars:
  //   userData     (from the users table by userID)
  //   quizData     (from the quizzes table by quizID)
  //   sessionData  (from the quiz_sessions table by sessionID, preferably with a duration column = end_time - start_time but not necessary)
  // IN ADDITION:
  //   Add an extra property called sessionData.responses
  //     -- this should be an ARRAY of multiple { question, answer } (one for each question in the quiz)
  //        question => a string => the question body
  //        answer => an object => a single row from the session_answers JOIN answers WHERE session_answers.answer_id = answers.id

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
        return isQuizFavoritedByUser(user_id, quizData.id);
      })
      .then(rows => {
        quizData.is_favorited = (rows.length > 0);
        const templateVars = {
          alerts,
          userData,
          currentPage,
          rankData,
          userData,
          quizData,
          sessionData
        };
        res.render("quiz_results", templateVars);
      })
      .catch(err => {
        console.error(err);
        req.flash("warning", `Sorry, we couldn't find any quiz results with ID ${req.params.resultID}!`);
        res.redirect("/404");
      });
  });

  return router;

};