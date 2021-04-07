const express = require("express");
const router = express.Router();
const moment = require("moment");

module.exports = (db) => {

  // /users/dashboard
  router.get("/dashboard", (req, res) => {
    const {
      alerts,
      userData,
      currentPage,
      rankData
    } = res.locals.vars;

    let userQuizzes, userHistory, userFavorites;
    if (!userData) {
      req.flash("warning", "You must be logged in to do that!");
      res.redirect("/login");
    } else {
      db.getQuizzesForUser(userData.id)
      .then(rows => {
        userQuizzes = rows;
        for (let quiz of userQuizzes) {
          quiz.creation_time = moment(quiz.creation_time).format("LLLL");
        }
        return db.getSessionsByUser(userData.id);
      })
      .then(rows => {
        userHistory = rows;
        for (let session of userHistory) {
          session.end_time = moment(session.end_time).format("LLLL");
        }
        
        return db.getFavoritesForUser(userData.id);
      })
      .then(rows => {
        userFavorites = rows;
        for (let quiz of userFavorites) {
          quiz.creation_time = moment(quiz.creation_time).format("LLLL");
        }
        const templateVars = {
          alerts,
          userData,
          currentPage,
          rankData,
          userQuizzes,
          userHistory,
          userFavorites
        };
        res.render("dashboard", templateVars);
      })
      .catch(err => console.error(err));
    }
  });

  // /users/:userid
  router.get("/:userid", (req, res) => {
    // const {
    //   alerts,
    //   userData,
    //   currentPage
    // } = res.locals.vars;
    // const templateVars = {
    //   alerts,
    //   userData,
    //   currentPage
    // };
  });

  router.post("/:userID/favorites/:quizID", (req, res) => {
    db.addFavorite(req.params.userID, req.params.quizID)
    .then(rows => {
      quiz_id = rows[0];
      req.flash("success", "Quiz added to favorites!");
      res.redirect(`/quizzes/${quiz_id}`)
    })
    .catch(err => console.error(err));

  });

  router.delete("/:userID/favorites/:quizID", (req, res) => {
    console.log(req);
    
  });

  return router;
};