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
    // db.getUserByID("SELECT * FROM users;")
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