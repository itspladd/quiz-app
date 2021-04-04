const express = require("express");
const router = express.Router();

module.exports = (db) => {

  /*
  EXAMPLE USAGE OF DB FUNCTIONS
  db.getUserByID(3)
  .then(rows => console.log(rows));

  db.getUserByUsername('pladd')
  .then(rows => console.log(rows));
*/

  // /users/dashboard
  router.get("/dashboard", (req, res) => {
    const {
      alerts,
      userData,
      currentPage
    } = res.locals.vars;
    const templateVars = {
      alerts,
      userData,
      currentPage
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