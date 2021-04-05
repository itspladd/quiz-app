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

// Fetch and load questions and answers from the database with the given quiz ID
// If no data is received, timeout after the given delay
const loadQuiz = (quizID, callback, delay = 5000) => {

  let data;
  // Submit a post request with data = quizID and do NOT redirect
  $.ajax({
    url: `/quizzes/${quizID}/sessions`,
    type: "POST"
  })
    .then(res => {
      data = res;
    });

  const timeout = setTimeout(() => {
    clearInterval(loader);
    console.log("timed out - no data received from server");
  }, delay);

  const loader = setInterval(() => {
    console.log("downloading...");
    if (data) {
      clearTimeout(timeout);
      clearInterval(loader);
      callback(data);
    }
  }, 10)

}

const playQuiz = (data) => {

  const sessionID = data.sessionID;

  console.log("STARTING QUIZ")

  showSession();

}

const showSession = () => {
  // Hide quiz front page

  const quizFront = $("#quiz-front")
  quizFront.fadeOut();

  const quizSession = $("#quiz-session")

  // Display "Starting Quiz"
  // showQuestion(quizSession, "What is the capital of Canada?");

}

const showQuestion = (quizSession, question) => {

  const $question = $(`


  `)

}

$(document).ready(function() {


  // Get EJS variable data
  const quizInfo = getQuizData();
  const playButton = $("#play-quiz");

  // When the user clicks play, send the quizID to the server
  // Expected response: JSON containing the keys "sessionID", "questions"
  playButton.on("click", function() {

    loadQuiz(quizInfo.id, playQuiz);

  })

});

// QUIZ_SESSIONS_RESULTS

// sessionID
// correctQuestionIDs: [],
// incorrectQuestionIDs: []