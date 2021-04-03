const express = require("express");
const router = express.Router();

module.exports = (db) => {

  // /users/dashboard
  router.get("/dashboard", (req, res) => {
    // db.query("SELECT * FROM users;")
    //   .then(data => {
    //     const users = data.rows;
    //     return { users };
    //   })
    //   .catch(err => {
    //     res
    //       .status(500)
    //       .json({ error: err.message });
    //   });
    res.render("dashboard");
  });

  // /users/:userid
  router.get("/:userid", (req, res) => {
    // db.query("SELECT...")
    //   .then()
    //   .catch();
  });

  return router;
};