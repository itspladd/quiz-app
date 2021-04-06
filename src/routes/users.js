const express = require("express");
const router = express.Router();

module.exports = (db) => {

  // /users/dashboard
  router.get("/dashboard", (req, res) => {
    const {
      alerts,
      userData,
      currentPage,
      rankData
    } = res.locals.vars;
    if (!userData) {
      req.flash("warning", "You must be logged in to access that page!");
      res.redirect("/login");
    } else {
      db.getQuizzesForUser(userData.id)
      const templateVars = {
        alerts,
        userData,
        currentPage,
        rankData
      };
      res.render("dashboard", templateVars);
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