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

  showSession(data);

  // Hide quiz front component
  $("#quiz-front").fadeOut();

  // Create question page component
  let number = 1;
  const length = data.questions.length;

  let current = 0;

  for (const entry of data.questions) {
    console.log(entry);
    // const question = entry.question.body;
    // const answers = entry.answers.map(ans => ans.body);
    // const component = createQuestionPage(question, answers, number, length);
    // number++;
  }




}

// Given a question number and array of answers, create a quiz question page
const createQuestionPage = (question, answers, number, length) => {

  // Get parent container
  const $parent = $("#quiz-session");

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

  return $parent;

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