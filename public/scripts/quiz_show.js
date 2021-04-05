// Retrieve quizData from EJS variables
const getQuizData = () => {

  const quizData = {};
  const ejsData = $("#data-ejs .data-key");
  for (const dataKey of ejsData) {
    const key = $(dataKey).attr("title");
    const value = $(dataKey).html();
    quizData[key] = value;
  };

  return quizData;

}

$(document).ready(function() {


  // Get EJS variable data
  const quizData = getQuizData();

  const playButton = $("#play-quiz");

  // When the user clicks play, send the quizID to the server
  // Expected response: JSON containing the keys "sessionID", "questions"
  playButton.on("click", function() {



    // Submit a post request with data = quizID and do NOT redirect
    $.ajax({
      url: `/quizzes/${quizData.id}/sessions`,
      type: "POST"
    })
      .then(res => {
        const resData = JSON.parse(res);
        // Add sessionID and questions to quizData
        quizData.sessionID = resData.sessionID;
        quizData.questions = resData.questions;
        console.log(quizData.questions);
      });

  })

});

// QUIZ_SESSIONS_RESULTS

// sessionID
// correctQuestionIDs: [],
// incorrectQuestionIDs: []