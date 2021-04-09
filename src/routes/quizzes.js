/* eslint-disable */

const express = require("express");
const router = express.Router();
const utils = require("../lib/utils");
const moment = require("moment");

module.exports = (db) => {

  // All Quizzes
  router.get("/", (req, res) => {
    const {
      alerts,
      userData,
      currentPage,
      rankData
    } = res.locals.vars;
    db.getPublicQuizzes()
      .then(quizData => {
        const templateVars = {
          alerts,
          userData,
          currentPage,
          quizData,
          rankData
        };
        res.render("quiz_index", templateVars);
      })
      .catch(err => console.error(err));
  });

  // Form to create a new quiz
  router.get("/new", (req, res) => {
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
      // SUCCESS: User is logged in
    } else {
      const templateVars = {
        alerts,
        userData,
        currentPage,
        rankData
      };
      res.render("quiz_new", templateVars);
    }
  });

  // Quiz show page
  router.get("/:quizID", (req, res) => {
    const {
      alerts,
      userData,
      currentPage,
      rankData
    } = res.locals.vars;
    let quizData;
    const quiz_id = req.params.quizID;
    const user_id = userData ? userData.id : null;
    db.getQuizByID({ quiz_id, user_id })
      .then(rows => {
        // Convert date/time data to a more readable format
        quizData = rows[0];
        creationDate = new Date(quizData.creation_time);
        quizData.relative_time = utils.convertTimestamp(quizData.creation_time);
        quizData.creation_time = moment(creationDate).format("LLLL");
        return db.getReviewsByQuizId(quiz_id);
      })
      .then(reviewData => {
        // Parse the created_at value to get a "created x days ago" string
        for (let review of reviewData) {
          review.timestamp = utils.convertTimestamp(review.created_at);
        }
        quizData.reviews = reviewData;
        const templateVars = {
          alerts,
          userData,
          currentPage,
          rankData,
          quizData
        };
        res.render("quiz_show", templateVars);
      })
      .catch(err => {
        console.error(err);
        req.flash("danger", "Either the URL you entered is invalid or that page is no longer available.");
        res.redirect("/404");
      });
  });

  // Create a new quiz
  router.post("/", (req, res) => {

    const {
      userData
    } = res.locals.vars;

    // After the form data is received...

    // 1. Check that the user is signed in
    // ERROR: User is not logged in
    if (userData === null) {
      req.flash("warning", "You must be logged in to do that.");
      res.redirect("/login");
      // SUCCESS: User is logged in
    } else if (userData) {

      // 2. Validate the form data and ensure that all table column values are present & of the right type
      // Helper function: validateFormBody(req.body) => true or false;
      const valid = true;

      // 3. Construct the quiz variable to contain everything that db.addQuiz() needs
      if (valid) {
        const quiz = req.body;
        quiz.author_id = userData.id;
        // After quiz is constructed with all of the values it needs, pass it into db.addQuiz();
        db.addQuiz(quiz)
          .then(rows => {
            // addQuiz returns an array of promises to all the quiz/question/answer data, but the quiz itself is the first element
            const quizData = rows[0];
            req.flash("success", "Quiz created successfully!");
            res.json(quizData.id);
          })
          .catch(err => console.error(err));
      }
    }

  });

  // Start a new quiz session
  router.post("/:quizID/sessions", (req, res) => {
    const {
      userData
    } = res.locals.vars;
    const quiz_id = req.params.quizID;
    const user_id = userData ? userData.id : null;
    db.getQuizQuestionsAndAnswers(quiz_id)
      .then(questions => {
        if (questions.length === 0) {
          res.redirect("/404");
        } else {
          // Create a new entry in the quiz_sessions table
          db.addSession({
            quiz_id,
            user_id
          })
          // On successful session creation, respond to the user's PLAY QUIZ ajax post request with JSON data
            .then(rows => {
              session = rows[0];
              // Add the sessionID to the quizData array
              const data = {
                questions,
                sessionID: session.id
              };
              // Send all of the data back to the client as a JSON
              res.json(data);
            })
            .catch(err => console.error(err));

        }
      });
  });

  // Add a new review
  router.post("/:quizID/reviews", (req, res) => {
    const reviewData = req.body;
    db.addReview(reviewData)
      .then(rows => res.json(rows[0]))
      .catch(() => {
        req.flash("warning", "Sorry, there was a problem when submitting your review.");
        res.redirect("/home");
      });
  });

  // Update a session at completion
  router.put("/:quizID/sessions/:sessionID", (req, res) => {
    // Create the session_answers entries for this session, using the session_id and answer_ids
    const data = req.body;
    session_id = data.session_id;
    const sessionAnswers = data.answers.map(elem => {
      return {
        session_id,
        answer_id: elem
      };
    });
    db.insert("session_answers", sessionAnswers)
      .then(() => db.markSessionEndTime(session_id))
      .then(() => db.insert("results", { // Create results entry for this session
        session_id
      }))
      .then(resultRows => res.json(resultRows[0].id)) // Send a JSON response with the result ID
      .catch(err => console.error(err));
  });

  // Toggle public/unlisted for a quiz, or featured/unfeatured
  router.patch("/:quizID", (req, res) => {
    const {
      userData
    } = res.locals.vars;
    const user_id = userData ? userData.id : null;
    const action = req.body.action;
    const redirectURL = req.body.origin;
    const quizID = req.params.quizID;
    db.getQuizAuthor(quizID)
      .then(rows => {
        const author = rows[0].author_id;
        // ERROR: The user is not an admin and not the owner of the quiz
        if (!userData.is_admin && user_id !== author) {
          req.flash("danger", "You don't have permission to do that!");
          res.redirect("/home");
          return;
        // PUBLIC: toggle public/unlisted for the quizID
        } else if (action === "public") {
          db.toggleQuizPublic(quizID)
            .then(rows => {
              const isPublic = rows[0].public;
              req.flash("success", `${userData.is_admin ? "ADMIN: " : ""}Quiz ${ isPublic ? "published" : "unlisted" } successfully!`);
              res.redirect(redirectURL);
            })
            .catch(err => console.error(err));
        // FEATURE: toggle featured/unfeatured for the quizID (admin only)
        } else if (userData.is_admin && action === "feature") {
          db.toggleQuizFeatured(quizID)
            .then(rows => {
              const isFeatured = rows[0].featured;
              req.flash("success", `${userData.is_admin ? "ADMIN: " : ""}Quiz ${ isFeatured ? "featured" : "unfeatured" } successfully!`);
              res.redirect(redirectURL);
            })
            .catch(err => console.error(err));
        }
      })
      .catch(err => console.error(err));
  });

  // "Delete a quiz", which just deactivates it in the database
  router.delete("/:quizID", (req, res) => {
    const {
      userData
    } = res.locals.vars;
    const user_id = userData ? userData.id : null;
    db.getQuizAuthor(req.params.quizID)
      .then(rows => {
        const author = rows[0].author_id;
        // ERROR: The user is not an admin and not the owner of the quiz
        if (!userData.is_admin && user_id !== author) {
          req.flash("danger", "You don't have permission to do that!");
          res.redirect("/home");
          return;
        } else {
          db.toggleQuizActive(req.params.quizID)
            .then(() => {
              req.flash("success", `${userData.is_admin ? "ADMIN: " : ""}Quiz deleted successfully!`);
              res.redirect("/users/dashboard");
            })
            .catch(err => console.error(err));
        }
      })
      .catch(err => console.error(err));
  });

  return router;

};