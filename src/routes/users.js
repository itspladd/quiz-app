/* eslint-disable */

const express = require("express");
const router = express.Router();
const moment = require("moment");

module.exports = (db) => {

  // Dashboard
  router.get("/dashboard", (req, res) => {
    const {
      alerts,
      userData,
      currentPage,
      rankData
    } = res.locals.vars;

    let userQuizzes, userHistory, userFavorites;
    if (!userData) {
      req.flash("warning", "You must be logged in to do that!");
      res.redirect("/login");
    } else {
      db.getQuizzesForUser(userData.id)
        .then(rows => {
          userQuizzes = rows;
          for (let quiz of userQuizzes) {
            quiz.creation_time = moment(quiz.creation_time).format("LLLL");
          }
          return db.getSessionsByUser(userData.id);
        })
        .then(rows => {
          userHistory = rows;
          for (let session of userHistory) {
            session.end_time = moment(session.end_time).format("LLLL");
          }

          return db.getFavoritesForUser(userData.id);
        })
        .then(rows => {
          userFavorites = rows;
          for (let quiz of userFavorites) {
            quiz.creation_time = moment(quiz.creation_time).format("LLLL");
          }
          const templateVars = {
            alerts,
            userData,
            currentPage,
            rankData,
            userQuizzes,
            userHistory,
            userFavorites
          };
          res.render("users_dashboard", templateVars);
        })
        .catch(err => console.error(err));
    }
  });

  // Account settings page
  router.get("/:userID", (req, res) => {
    const {
      alerts,
      userData,
      currentPage,
      rankData
    } = res.locals.vars;
    // ERROR: User is not logged in
    if (!userData) {
      req.flash("warning", "You must be logged in to do that!");
      res.redirect("/login");
    } else {
      // ERROR: User is logged in but trying to access with a different user ID
      if (Number(req.params.userID) !== userData.id) {
        req.flash("danger", "You don't have permission to access this page.");
        res.redirect("/home");
      } else {
        // SUCCESS: User is logged in and accessing their own account page
        const templateVars = {
          alerts,
          userData,
          currentPage,
          rankData
        };
        res.render("users_account", templateVars);
      }
    }
  });

  // Add a quiz to the user's favorites
  router.post("/:userID/favorites/:quizID", (req, res) => {
    const {userID, quizID} = req.params;
    db.addFavorite({ user_id: userID, quiz_id: quizID })
      .then(rows => {
        quiz_id = rows[0].quiz_id;
        req.flash("success", "Quiz added to favorites!");
        res.redirect(`/quizzes/${quiz_id}`);
      })
      .catch(err => console.error(err));
  });

  // Remove a quiz from the user's favorites
  router.delete("/:userID/favorites/:quizID", (req, res) => {
    const {userID, quizID} = req.params;
    const source = req.body.source;
    db.deleteFavorite({ user_id: userID, quiz_id: quizID })
      .then(rows => {
        quiz_id = rows[0].quiz_id;
        req.flash("success", "Quiz removed from favorites!");
        res.redirect(source);
      })
      .catch(err => {
        console.error(err);
        req.flash("danger", "Oops, something went wrong! Try again later.");
        res.redirect(source);
      });
  });

  // Update a user's avatar
  router.patch("/:userID", (req, res) => {
    const {
      userData
    } = res.locals.vars;
    const userID = Number(req.params.userID);
    if (userData.id !== userID) {
      req.flash("danger", "You don't have permission to do that!");
      res.redirect("/home");
    } else {
      const avatarID = Number(req.body.avatar_id);
      db.updateUserAvatar(userID, avatarID)
        .then(() => {
          req.flash("success", "Avatar updated successfully!");
          res.redirect(`/users/${userData.id}`);
        })
        .catch(err => console.error(err));
    }
  });

  // Delete request for deleting a user's account
  router.delete("/:userID", (req, res) => {
    const {
      userData
    } = res.locals.vars;
    const userID = Number(req.params.userID);
    if (userData.id !== userID) {
      req.flash("danger", "You don't have permission to do that!");
      res.redirect("/home");
    } else {
      db.deleteUserByID(userID)
        .then(() => {
          req.session.userID = null;
          req.flash("success", "Account deleted successfully! Goodbye!");
          res.redirect("/home");
        })
        .catch(err => console.error(err));
    }
  });

  return router;
};