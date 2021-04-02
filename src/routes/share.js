const express = require("express");
const router = express.Router();

module.exports = (db) => {

  // /results/:sessionID --> visible to everyone
  router.get("/:sessionID", (req, res) => {
    res.render("quiz_results");
  });

  return router;
}