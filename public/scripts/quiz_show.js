// Retrieve quizInfo from EJS variables
const getEjsData = () => {

  const quizInfo = {};
  const ejsData = $("#data-ejs .data-quiz-key");
  for (const dataKey of ejsData) {
    const key = $(dataKey).attr("title");
    const value = $(dataKey).html();
    quizInfo[key] = value;
  }

  return quizInfo;

};

// Fetch and load questions and answers from the database with the given quiz ID
// If no data is received, timeout after the given delay
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
      // Shuffle the order of questions and responses
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

};

// Shuffle the order of questions and responses in quizData
const shuffleQuizData = (quizData) => {

  let shuffledQuestions = shuffleArray(quizData.questions);
  for (let i = 0; i < shuffledQuestions.length; i++) {
    const shuffledAnswers = shuffleArray(shuffledQuestions[i].answers);
    shuffledQuestions[i].answers = shuffledAnswers;
  }

  quizData.questions = shuffledQuestions;

  return quizData;

};

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

    // Store session data
    sessionData = {
      quizID: quizInfo.id,
      sessionID: quizData.sessionID
    }

    // When there are no more questions remaining, process the user response data
    processResults(sessionData.quizID, sessionData.sessionID);
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
      window.location.replace("/404");
    });

};

// Return true if the review form is valid, otherwise display an error
const showReviewErrors = () => {
  const title = $("#review-title").val().trim();
  const comment = $("#review-comment").val().trim();
  const rating = $("#review-rating").val().trim();

  const $error = $("#review-error");

  if (!title || !comment || !rating) {
    $error.html("Missing required fields");
  } else if (title.length > 60) {
    $error.html("Title exceeds 60-character limit");
  } else if (comment.length > 90) {
    $error.html("Comment exceeds 90-character limit");
  } else if (!(["1", "2", "3", "4", "5"].includes(rating))) {
    $error.html("Invalid rating");
  } else {
    $error.addClass("d-none");
    return true
  }
}

// Send a POST request to the server with the user review form data
const submitReview = () => {

  const data = {
    quiz_id: sessionData.quizID,
    session_id: sessionData.sessionID,
    user_id: $("#review-user").val().trim(),
    title: $("#review-title").val().trim(),
    comment: $("#review-comment").val().trim(),
    rating: Number($("#review-rating").val().trim())
  }

  $.ajax({
    url: `/quizzes/${data.quiz_id}/reviews`,
    type: "POST",
    data
  })
    .then(() => {
      $("#quiz-review-form").remove();
      $("#review-submitted").removeClass("d-none");
    })
    .catch(() => {
      $("#review-error").removeClass("d-none");
      $("#review-error").html("An error occurred")
    });

}

const userAnswers = [];
let sessionData = {};
let complete = false;

$(document).ready(function() {

  // Get quiz information from EJS
  const quizInfo = getEjsData();

  // When the user clicks play, send the quizID to the server and create a new session
  // The server will respond with quiz question data
  $("#play-quiz").on("click", function() {

    loadQuiz(quizInfo);

  });

  // When the user submits a review, send the form data to the server
  $("#review-form").on("submit", function(event) {
    event.preventDefault();

    // Check that the form is complete
    const isValid = showReviewErrors();

    if (isValid) {
      submitReview();
    }

  });

});