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
    
    let userQuizzes, userHistory;
    if (!userData) {
      req.flash("warning", "You must be logged in to access that page!");
      res.redirect("/login");
    } else {
      db.getQuizzesForUser(userData.id)
      .then(rows => {
        userQuizzes = rows;
        for (let quiz of userQuizzes) {
          quiz.creation_time = moment(quiz.creation_time).format("LLLL");
        }
        const templateVars = {
          alerts,
          userData,
          currentPage,
          rankData,
          userQuizzes
        };
        res.render("dashboard", templateVars);
      })
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

  return router;
};