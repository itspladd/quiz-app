const express = require("express");
const router = express.Router();

module.exports = (db) => {

  // /results/:sessionID
  router.get("/:sessionID", (req, res) => {
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
  });

  return router;
};