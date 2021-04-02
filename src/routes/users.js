const express = require("express");
const router = express.Router();

module.exports = (db) => {

  // /users/dashboard
  router.get("/dashboard", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        return { users };
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // /users/:userid
  router.get("/:userid", (req, res) => {
    db.query(`SELECT...`)
      .then()
      .catch();
  });

  // /users
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        return { users };
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
}



// app.get("/dashboard", (req, res) => {

// });

