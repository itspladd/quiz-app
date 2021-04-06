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
    const templateVars = {
      alerts,
      userData,
      currentPage,
      rankData
    };
    res.render("dashboard", templateVars);
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