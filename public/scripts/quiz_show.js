// After the quiz has ended, the client sends the following data to the server via a PUT request on route :
//  {end_time, session_id, answers}
//   -- (answers is an array of answerIDs)
// Server uses this data to store the session_answers, update the quiz_session end_time and create a results table entry
// Server should send back a result ID which is used to REDIRECT the client to the results page on the client side
//   -- Redirect to GET route: /results/:resultID

// NEW GET ROUTE FOR "results": Given a resultID, the results page should receive the following data from templateVars:
//   userData     (from the users table by userID)
//   quizData     (from the quizzes table by quizID)
//   sessionData  (from the quiz_sessions table by sessionID, preferably with a duration column = end_time - start_time but not necessary)
// IN ADDITION:
//   Add an extra property called sessionData.responses
//     -- this should be an ARRAY of multiple { question, answer } (one for each question in the quiz)
//        question => a string => the question body
//        answer => an object => a single row from the session_answers JOIN answers WHERE session_answers.answer_id = answers.id

// Retrieve quizInfo from EJS variables
const getQuizInfo = () => {

  const quizInfo = {};
  const ejsData = $("#data-ejs .data-key");
  for (const dataKey of ejsData) {
    const key = $(dataKey).attr("title");
    const value = $(dataKey).html();
    quizInfo[key] = value;
  }

  return quizInfo;

};

// Fetch and load questions and answers from the database with the given quiz ID
// If no data is received, timeout after the given delay
// TODO: Display an error on receiving a 404 status code (happens when quizID in the ajax url is invalid)
const loadQuiz = (quizInfo, delay = 5000) => {

  let quizData;

  // Submit a POST request with the given quiz ID
  $.ajax({
    url: `/quizzes/${quizInfo.id}/sessions`,
    type: "POST"
  })
    .then(res => {
      quizData = res;
    });

  // Timeout after the given delay if no response is received from the server
  const timeout = setTimeout(() => {
    clearInterval(loader);
    return;
  }, delay);

  // Check for server response data on an interval, clearing the timeout and interval once received
  const loader = setInterval(() => {
    if (quizData) {
      clearTimeout(timeout);
      clearInterval(loader);
      // Clear the quiz front page
      $("#quiz-front").remove();
      // TODO: Shuffle the questions and responses
      const shuffledQuizData = shuffleQuizData(quizData);
      // Start the quiz
      getNextQuestion(quizInfo, shuffledQuizData);
      return;
    }
  }, 10);

};

// Return a new array containing the elements of the given array in a randomized order
const shuffleArray = (array) => {

  const deepCopy = array.slice();
  const shuffled = [];
  while (deepCopy.length > 0) {
    shuffled.push(deepCopy.splice(Math.floor(Math.random() * deepCopy.length), 1)[0]);
  }
  return shuffled;

}

// Shuffle the order of questions and responses in quizData
const shuffleQuizData = (quizData) => {

  let shuffledQuestions = shuffleArray(quizData.questions);
  for (let i = 0; i < shuffledQuestions.length; i++) {
    const shuffledAnswers = shuffleArray(shuffledQuestions[i].answers);
    shuffledQuestions[i].answers = shuffledAnswers;
  }

  quizData.questions = shuffledQuestions;

  return quizData;

}

// Given quiz data and a question number, create a single quiz question page component
const getNextQuestion = (quizInfo, quizData, number = 0) => {

  // Clear the page of any previous questions
  $("#quiz-session").remove();

  // If there are questions remaining, display the next one
  if (number < quizData.questions.length) {

    const data = quizData.questions[number];

    const title = quizInfo.title;
    const length = quizData.questions.length;
    const question = data.question.body;
    const answers = data.answers;

    // Create parent container
    const $parent = $("<div id=\"quiz-session\" class=\"d-flex flex-column\">");

    // Create quiz title
    const $title = $(`
      <div id="quiz-title" class="text-muted initialism">
        ${title}
      </div>
    `);

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

    // Create the answers container with all options
    const $answersContainer = $("<div id=\"quiz-answers\" class=\"d-flex flex-column\">");
    for (const optionData of answers) {
      // Create the answer option element
      const $opt = $(`<span class="quiz-option d-flex align-items-center">${optionData.body}</span>`);
      // Bind a click event handler to the option component containing the response data
      $($opt).bind("click", function() {
        const userResponse = {
          question,
          answer: optionData
        };
        // Store the answer data associated with the selected option in a global variable
        userAnswers.push(userResponse);
        // Generate the next question page
        getNextQuestion(quizInfo, quizData, number + 1);
      });
      // Add the option component to the answers container
      $answersContainer.append($opt);
    }

    // Append all of the child components to the parent
    $parent
      .append($title)
      .append($number)
      .append($question)
      .append($answersContainer);

    // Append the parent to the main container
    $("#main-split-content").append($parent);

  } else {

    // When there are no more questions remaining, process the user response data
    processResults(quizInfo.id, quizData.sessionID);
    complete = true;
    return;

  }

};

// Process the user response data and display a button that will submit it to the server
const processResults = (quizID, sessionID) => {

  // Show quiz end component
  $("#quiz-end").addClass("d-flex").removeClass("d-none");

  // Bind the submit handler to the quiz end button
  $("#submit-quiz").bind("click", function() {

    // If the quiz is complete and the View Results button is pressed, construct and submit the data to the server
    if (complete) {
      const userResponseData = {
        end_time: new Date(),
        session_id: sessionID,
        answers: userAnswers.map(ans => ans.answer.id)
      };
      submitResults(userResponseData, quizID, sessionID);
    }

  });

};

// Send a POST request to the server with the user response data
const submitResults = (data, quizID, sessionID) => {

  $.ajax({
    url: `/quizzes/${quizID}/sessions/${sessionID}`,
    type: "PUT",
    data
  })
    .then(resultID => {
      // Redirect the user to the result page using the resultID received from the server
      window.location.replace(`/results/${resultID}`);
    })
    .catch(() => {
      window.location.replace(`/404`);
    });

};

const userAnswers = [];
let complete = false;

$(document).ready(function() {

  // Get quiz information from EJS
  const quizInfo = getQuizInfo();

  // When the user clicks play, send the quizID to the server and create a new session
  // The server will respond with quiz question data
  $("#play-quiz").on("click", function() {

    loadQuiz(quizInfo);

  });

});