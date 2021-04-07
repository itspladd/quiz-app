const express = require("express");
const router = express.Router();
const utils = require("../lib/utils");
const moment = require("moment");

module.exports = (db) => {

  // /quizzes
  router.get("/", (req, res) => {
    // Browse all
    // Get all quizzes (this is where we'd add a sort parameter in the future)
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

  // /quizzes/new
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

  // /quizzes/:quizID --> generates a session and results/:sessionID on the client-side
  router.get("/:quizID", (req, res) => {
    const {
      alerts,
      userData,
      currentPage,
      rankData
    } = res.locals.vars;
    let quizData;
    const quiz_id = req.params.quizID;
    db.getQuizByID(quiz_id)
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
        return db.isQuizFavoritedByUser(userData.id, quiz_id);
      })
      .then(rows => {
        quizData.is_favorited = (rows.length > 0);
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
        req.flash("warning", `Sorry, we couldn't find a quiz with the ID ${quiz_id}.`)
        res.redirect("/404");
      });
  });

  // Create a new quiz
  // Restrictions: user must be logged in
  router.post("/", (req, res) => {

    const {
      userData
    } = res.locals.vars;

    // After the form data is received...

    // 1. Check that the user is signed in
    // ERROR: User is not logged in
    if (userData === null) {
      console.log("You must be logged in to do that.");
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
  // Restrictions: none
  // NOTE: Users do NOT need to be logged in to start a quiz. This means that a quiz_session should
  // be generated, except user_id would be null, and no post-quiz data will be received by the server
  // (no results or session_answers).
  // LATER: If we want to, we can track anonymous quiz plays by counting sessions with user_id = null
  router.post("/:quizID/sessions", (req, res) => {
    const {
      userData
    } = res.locals.vars;
    const quiz_id = req.params.quizID;
    const user_id = userData ? userData.id : null;
    db.getQuizQuestionsAndAnswers(quiz_id)
      .then(questions => {
        // If there's no data, it means quiz_id was invalid and there were no Q's and A's
        // check this: i'm not sure what the value would be - if the quiz id doesn't exist the condition would be if length = 0?
        // Just make sure this redirect goes through if no data is received
        if (questions.length === 0) {
          res.redirect("/404");

          // If the quiz exists and its questions/answers were retrieved successfully...
        } else {
          // Create a new entry in the quiz_sessions table
          db.addSession({
            quiz_id,
            user_id
          })
            .then(session => {
              console.log(`New session started by ${userData ? userData.username : "anonymous" }`);
              // On successful session creation, respond to the user's PLAY QUIZ ajax post request with JSON data
              // containing all of a quiz's questions and answers
              // question => a row from the questions table connected to
              // answers => the 4 rows from the answers table

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

  router.post("/:quizID/reviews", (req, res) => {
    const reviewData = req.body;
    db.addReview(reviewData)
    .then(rows => res.json(rows[0]))
    .catch(err => {
      req.flash("warning", "Sorry, there was a problem when submitting your review.");
      res.redirect("/");
    });
  });

  router.put("/:quizID/sessions/:sessionID", (req, res) => {
    const data = req.body;
    session_id = data.session_id;
    const sessionAnswers = data.answers.map(elem => {
      return {
        session_id,
        answer_id: elem
      };
    });
    db.insert("session_answers", sessionAnswers)
      .then(rows => db.markSessionEndTime(session_id))
      .then(rows => db.insert("results", {
        session_id
      }))
      .then(resultRows => res.json(resultRows[0].id))
      .catch(err => console.error(err));
  });

  // Toggle public/unlisted for a quiz
  router.patch("/:quizID", (req, res) => {
    const {
      userData
    } = res.locals.vars;
    db.getQuizAuthor(req.params.quizID)
    .then(rows => {
      const author = rows[0].author_id;
      if (userData.id !== author) {
        req.flash("danger", "You don't have permission to do that!");
        res.redirect("/");
        return;
      } else {
        db.toggleQuizPublic(req.params.quizID)
        .then(rows => {
          req.flash("success", "Quiz updated successfully!");
          res.redirect("/users/dashboard");
        })
        .catch(err => console.error(err));
      }
    })
    .catch(err => console.error(err));
  })

  // User can "delete" a quiz, which just deactivates it in our DB.
  router.delete("/:quizID", (req, res) => {
    const {
      userData
    } = res.locals.vars;
    db.getQuizAuthor(req.params.quizID)
    .then(rows => {
      const author = rows[0].author_id;
      if (userData.id !== author) {
        req.flash("danger", "You don't have permission to do that!");
        res.redirect("/");
        return;
      } else {
        db.toggleQuizActive(req.params.quizID)
        .then(rows => {
          req.flash("success", "Quiz deleted successfully!");
          res.redirect("/users/dashboard");
        })
        .catch(err => console.error(err));
      }
    })
    .catch(err => console.error(err));
  })
  /*STRETCH: global results from this quiz
    router.get("/:quizID/results", (req, res) => {
    res.render("quiz_results");
  });
 */

  return router;

};