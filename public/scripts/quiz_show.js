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
    return
  }, delay);

  const loader = setInterval(() => {
    console.log("downloading...");
    if (data) {
      clearTimeout(timeout);
      clearInterval(loader);
      console.log("quiz data received from server!")
      callback(data);
      return
    }
  }, 10)

}

const playQuiz = (data) => {

  console.log("STARTING QUIZ")

  // Hide quiz front component
  removeElement($("#quiz-front"));
  console.log("Removing front component")

  // Obtain question count
  const numQuestions = data.questions.length;

  console.log("there are these many questions", data.questions.length);

  // Create first question page component
  let number = 0;
  // const currentPage = createQuestionPage(questionData, number);

}

// Given quiz data and a question number, create a single quiz question page component
const createQuestionPage = (data, number) => {

  // If the given number exceeds the actual number of questions available, exit
  if (number > data.questions.length) return false;

  const question = 123;

  // Create parent container
  const $parent = $(`<div id="quiz-session" class="d-flex flex-column">`);

  // Create quiz title
  const $title = $(`
  <div id="quiz-title" class="text-muted initialism">
    ${data.title}
  </div>
  `)

  // Create quiz question number
  const $number = $(`
    <div id="quiz-question-number" class="mt-4 mb-3">
      Question ${number} of ${length}
    </div>
  `);

  // Create quiz question
  const $question = $(`
    <div id="quiz-question" class="d-flex flex-column justify-content-center mb-4">
      <h1 class="h3">${question}</h1>
    </div>
  `);

  // Create answers container with all options
  const $answersContainer = $(`<div id="quiz-answers" class="d-flex flex-column">`);
  for (const option of answers) {
    const $opt = $(`<span class="quiz-option d-flex align-items-center">${option}</span>`);
    $answersContainer.append($opt);
  }

  // Append components to the parent container
  $parent
    .append($title)
    .append($number)
    .append($question)
    .append($answersContainer)

  // Append parent to the main container
  $("#main-split-content").append($parent);

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