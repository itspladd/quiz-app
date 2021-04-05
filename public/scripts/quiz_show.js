// Available data:
//   quizData, sessionID, q

$(document).ready(function() {

  const playButton = $("#play-quiz");

  // When the user clicks play, send the quizID to the server
  // Expected response: JSON containing the keys "sessionID", "questions"
  playButton.on("click", function() {
    console.log($("#quiz-data").html());

    // // Submit a post request with data = quizID and do NOT redirect
    // $.ajax({
    //   url: "/quizzes",
    //   type: "POST",
    //   data: quizData.id
    // })
    //   .then(data => {
    //     // On successful quiz submission, redirect to the new quiz show page
    //     console.log(data);
    //   });

  })

});

// QUIZ_SESSIONS_RESULTS

// sessionID
// correctQuestionIDs: [],
// incorrectQuestionIDs: []