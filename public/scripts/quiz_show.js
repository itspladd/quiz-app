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
const loadQuiz = (quizInfo, callback, delay = 5000) => {

  let quizData;

  // Submit a post request with data = quizID and do NOT redirect
  $.ajax({
    url: `/quizzes/${quizInfo.id}/sessions`,
    type: "POST"
  })
    .then(res => {
      quizData = res;
    });

  const timeout = setTimeout(() => {
    clearInterval(loader);
    console.log("timed out - no data received from server");
    return
  }, delay);

  const loader = setInterval(() => {
    console.log("downloading...");
    if (quizData) {
      clearTimeout(timeout);
      clearInterval(loader);
      console.log("quiz data received from server!")
      console.log("STARTING QUIZ")
      callback(quizInfo, quizData);
      return
    }
  }, 10)

}

const playQuiz = (quizInfo, quizData, number = 0) => {


  // Clear the page
  console.log("Clearing page")
  $("#main-split-content").empty();

  // Obtain question count
  const numQuestions = quizData.questions.length;

  // Create question page component
  createQuestionPage(quizInfo, quizData, number);

}

// Given quiz data and a question number, create a single quiz question page component
const createQuestionPage = (quizInfo, quizData, number) => {

  // If the given number exceeds the actual number of questions available, exit
  if (number > quizData.questions.length - 1) {
    console.log("Reached end of quiz!")
    console.log("User answers:")
    console.log(userAnswers);
    // Process results
    return processResults();
  }

  const data = quizData.questions[number];

  const title = quizInfo.title;
  const length = quizData.questions.length;
  const question = data.question.body;
  const answers = data.answers;
  // Each answer has question_id, body, is_correct, explanation

  // Create parent container
  const $parent = $(`<div id="quiz-session" class="d-flex flex-column">`);

  // Create quiz title
  const $title = $(`
    <div id="quiz-title" class="text-muted initialism">
      ${title}
    </div>
  `)

  // Create quiz question number
  const $number = $(`
    <div id="quiz-question-number" class="mt-4 mb-3">
      Question ${number + 1} of ${length}
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
    // Create the answer option element
    const $opt = $(`<span class="quiz-option d-flex align-items-center">${option.body}</span>`);
    // Set the variables associated with this specific answer
    const optionData = option;
    // Bind a click event handler to the option component
    $($opt).bind("click", function() {
      const userResponse = {
        question,
        answer: optionData
      };
      userAnswers.push(userResponse);
      // Generate the next quiz page
      playQuiz(quizInfo, quizData, number + 1);
    });
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

// Calculate and display the results using data stored in userAnswers
const processResults = () => {

  const endTime = new Date();
  // Calculate the user's score
  const length = userAnswers.length;
  let score = 0;
  for (const response of userAnswers) {
    score += response.answer.is_correct ? 1 : 0;
  }
  console.log(`You answered ${score} out of ${length} questions correctly!`);

  // Render a form to submit a post request that will:

  // Send the session data to the server
  // sessionID, array of answers, endTime
  // Server uses this data to store the session_answers, update the quiz_session end_time and create a results table entry
  // Server sends back a result ID which is used to REDIRECT the client to the results page
  // /quizzes/results/:resultID

  // NEW PAGE: Given a resultID, the results page will receive the following data from templateVars:
  // userData (from the users table by userID)
  // quizData (from the quizzes table by quizID)
  // sessionData (from the quiz_sessions table by sessionID)
  // IN ADDITION:
  //   Add sessionData.responses which is an ARRAY of multiple { question, answer } (one for each question in the quiz) where
  //   question => a string containing the question body
  //   answer => an object => a single row from the session_answers JOIN answers WHERE session_answers.answer_id = answers.id

}

const userAnswers = [];

$(document).ready(function() {

  // Get EJS variable data
  const quizInfo = getQuizData();
  const playButton = $("#play-quiz");


  // When the user clicks play, send the quizID to the server
  // Expected response: JSON containing the keys "sessionID", "questions"
  playButton.on("click", function() {

    loadQuiz(quizInfo, playQuiz);

  })

});

// QUIZ_SESSIONS_RESULTS

// sessionID
// correctQuestionIDs: [],
// incorrectQuestionIDs: []