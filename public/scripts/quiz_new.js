// Appends a question component to the given element
const addQuestionComponent = (element, additionalResponses = 2) => {

  let str = `
    <div class="form-group new-question d-flex flex-column">
      <header class="d-flex flex-row justify-content-between">
        <label for="question" class="question-label form-label text-muted mt-2">Question</label>
      </header>
      <span class="min-question"></span>
      <input class="input-question form-control" type="text" name="question" maxlength="250">
      <div class="responses">
        <label for="answer" class="form-label text-muted mt-2">Correct Answer</label>
        <input class="input-response form-control" type="text" maxlength="250">
        <label for="answer" class="form-label text-muted mt-2">Incorrect Answers</label>
        <input class="input-response form-control" type="text" maxlength="250">
  `;

  // Add additional response options (base minimum of 2 in total)
  for (let i = 0; i < additionalResponses; i++) {
    str += `<input class="input-response form-control mt-3" type="text" maxlength="250">`
  };

  str+= `
      </div>
      <div class="question-control d-flex flex-row justify-content-between mt-3">
        <span class="toggle minimize text-muted">hide</span>
        <div class="d-flex flex-row align-items-center">
          <span class="control-desc control-del">Delete </span><span class="icon icon-del"></span>
        </div>
      </div>
    </div>
  `;

  const $newForm = $(str);

  // Bind a click event handler to the delete button
  const deleteBtn = $newForm.find(".icon-del");
  $(deleteBtn).bind("click", function() {
    const component = $(this).closest(".new-question");
    removeElement(component);
    setTimeout(() => {
      updateCounter();
    }, 800);
  });

  // Bind a click event handler to the show/hide form toggler
  $($newForm).bind("click", function(event) {
    const $target = $(event.target);
    if ($($target).is(".toggle.maximize")) {
      $(this).find(".min-question").html("");
      $(this).find("input").slideDown();
      $(this)
        .find(".responses")
        .slideDown();
      $(this)
        .find(".toggle")
        .html("hide")
        .removeClass("maximize")
        .addClass("minimize");
    } else if ($($target).is(".toggle.minimize")) {
      const question = $(this).find("input").val();
      const answer = $(this).find(".input-response:first").val();
      setTimeout(() => {
        $(this).find(".min-question").html(`
          <p class="lead">${question || "N/A"}</p>
          <p class="mb-0">Answer: ${answer || "N/A"}</p>
        `);
      }, 150);
      $(this).find("input").slideUp();
      $(this).find(".responses").slideUp();
      $(this)
        .find(".toggle")
        .html("show")
        .removeClass("minimize")
        .addClass("maximize");
    }
  });

  // Add the form to the all questions container
  $newForm.css("display", "none").css("min-height", "0");
  element.append($newForm);
  addElement($newForm);

  // Minimize other forms
  setTimeout(() => {
    $(".toggle.minimize").not(":last").trigger("click");
  }, 1000);

  updateCounter();

};

// Update the question counter
const updateCounter = () => {

  const num = getNumQuestions();
  $("#questions-counter")
    .html(`Questions${num ? ` ( ${num} )` : ""}`);

  updateLabels();

};

// Update the question form # labels
const updateLabels = () => {

  let number = 1;
  for (const component of $(".question-label")) {
    $(component).html(`Question #${number}`);
    number++;
  }

};

// Return the number of questions
const getNumQuestions = () => {

  return $("#add-questions").children().length;

};

// Display any field errors
const showError = (errorMsg) => {

  const errorComponent = $("#new-quiz-error");
  if (errorMsg) {
    errorComponent.html(errorMsg);
  } else {
    errorComponent.empty();
  }

};

// Check that the form is complete and that there are sufficient questions and responses
const getQuestionFormErrors = (minQuestions = 2, minResponses = 4) => {

  let error = null;

  const questions = $("#add-questions").children();
  if (questions.length < minQuestions) {
    error = `Minimum of ${minQuestions} questions must be provided`;
  }

  const allQuestions = $(".input-question");
  for (const question of allQuestions) {
    let valid = true;
    const userQuestion = $(question).val().trim();
    // Questions may not be non-empty
    if (userQuestion.length < 1) {
      error = "Question field may not be empty";
      valid = false;
    } else if (userQuestion.length > 250) {
      error = "Question field exceeds 250-character limit";
      valid = false;
    }
    const responses = $(question).next().find(".input-response");
    for (const response of responses) {
      const userResponse = $(response).val().trim();
      // Responses may not be non-empty
      if (userResponse.length < 1) {
        error = "Response field may not be empty";
        valid = false;
      } else if (userResponse.length > 250) {
        error = "Response field exceeds 250-character limit";
        valid = false;
      }
    }

    // Check for the minimum number of responses
    if (responses.length < minResponses) {
      error = `Minimum of ${minResponses} responses per question must be provided`;
      valid = false;
    }

    // Highlight question forms green/red if valid/invalid
    $(question).closest(".new-question")
      .css("border-color", valid ? "#31f37b" : "#e22d4b")
      .addClass(valid ? "valid-question" : "invalid-question");

    // Maximize invalid questions and minimize valid questions
    $(".invalid-question .maximize").trigger("click");
    $(".valid-question .minimize").trigger("click");

  }

  return error;

};

// Check that the quiz info fields are complete
const getQuizFormErrors = () => {

  let error = null;
  const title = getValue("#quiz-title");
  const desc = getValue("#quiz-desc");
  const categoryIDs = ["1", "2", "3"];
  const category = getValue("#quiz-category");
  const publicValues = ["true", "false"];
  const visibility = getValue("#quiz-visibility");

  if (!title || !desc || !category || !visibility) {
    error = "Missing required fields";
  } else {
    if (title.length > 30) {
      error = "Title exceeds 30-character limit";
    } else if (desc.length > 60) {
      error = "Description exceeds 60-character limit";
    } else if (!categoryIDs.includes(category)) {
      error = "Invalid category value";
    } else if (!publicValues.includes(visibility)) {
      error = "Invalid visibility value";
    }
  }

  return error;

};

// Retrieve and trim an input field's value
const getValue = (inputField) => {

  return $(inputField).val().trim();

};

// Submit form handler
const submitForm = () => {

  // Retrieve quiz info form data
  const title = getValue("#quiz-title");
  const description = getValue("#quiz-desc");
  const category_id = getValue("#quiz-category");
  const public = getValue("#quiz-visibility");

  // Retrieve quiz question form data
  const questions = [];
  const allQuestions = $(".input-question");
  for (const questionField of allQuestions) {
    const questionValue = getValue(questionField);
    const responseFields = $(questionField).next().find(".input-response");
    const responseValues = [];
    for (const responseField of responseFields) {
      const responseValue = getValue(responseField);
      const answer = { body: responseValue };
      responseValues.push(answer);
    }
    const question = {
      body: questionValue,
      answers: responseValues
    };
    questions.push(question);
  }

  // Submit a post request with the quiz data
  $.ajax({
    url: "/quizzes",
    type: "POST",
    data: {
      title,
      description,
      category_id,
      public,
      questions
    }
  })
    .then(quizID => {
      // On successful quiz submission, redirect to the new quiz show page
      setTimeout(() => {
        window.location.replace(`/quizzes/${quizID}`);
      }, 500);
    });

};

$(document).ready(function() {

  const questionsList = $("#add-questions");
  const addQuestionBtn = $(".icon-add");
  const quizForm = $("#new-quiz-form");

  // Add a new question when the user clicks the add question button
  addQuestionBtn.on("click", function() {

    addQuestionComponent(questionsList);

  });

  // On submit, check for form errors prior to submitting a POST request
  quizForm.on("submit", function(event) {

    event.preventDefault();

    // Display question form errors, if any
    const error = getQuizFormErrors() || getQuestionFormErrors();
    showError(error);

    // If there are no errors, construct data to be sent to the server
    if (!error) {
      submitForm();
    }

  });

  // Clear question validation highlights and error message on user input
  quizForm.on("input", function() {

    $(this).find(".new-question").css("border-color", "#fff");
    showError(false);

  });

});