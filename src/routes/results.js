const express = require("express");
const router = express.Router();

module.exports = (db) => {

  // /results/:resultID
  router.get("/:resultID", (req, res) => {
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
    res.render("quiz_results", templateVars);
const db = require("./db");

module.exports = {
  });

  return router;
};