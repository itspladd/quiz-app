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
      url: "/quizzes",
      type: "POST",
      data: "hey"
    })
      .then(data => {
        // On successful quiz submission, redirect to the new quiz show page
        console.log("sent")
        console.log(data);
      });

  })

});

// QUIZ_SESSIONS_RESULTS

// sessionID
// correctQuestionIDs: [],
// incorrectQuestionIDs: []