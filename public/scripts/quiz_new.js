// FIELD LIMITS:
// Title: 30 chars
// Desc: 60 chars
// Question/Ans: 250

// Appends a question component to the given element
const addQuestionComponent = (element) => {

  const $newForm = $(`
    <div class="form-group new-question">
        <label for="question" class="form-label text-muted mt-2">Question</label>
        <input class="input-question form-control" type="text" name="question" maxlength="250" required>
        <div class="responses">
          <label for="answer" class="form-label text-muted mt-2">Correct Answer</label>
          <input class="input-response form-control" type="text" name="answer[]" maxlength="250" required>
          <label for="answer" class="form-label text-muted mt-2">Incorrect Answers</label>
          <input class="input-response form-control" type="text" name="answer[]" maxlength="250" required>
          <input class="input-response form-control mt-3" type="text" name="answer[]" maxlength="250" required>
          <input class="input-response form-control mt-3" type="text" name="answer[]" maxlength="250" required>
        </div>
        <div class="question-control d-flex flex-row justify-content-end align-items-center mt-3">
          <span class="control-desc control-del">Delete </span><span class="icon icon-del"></span>
        </div>
      </div>
    </div>
  `);
  // Add delete button click event handler
  const deleteBtn = $newForm.find(".icon-del");
  $(deleteBtn).bind("click", function() {
    $(this).closest(".new-question").remove();
    // Update counter
    updateCounter();
  });
  // Add form to all questions container
  element.append($newForm);
  // Update counter
  updateCounter();

};

// Update the children counter of the given element
const updateCounter = () => {

  const num = getNumQuestions();
  $("#questions-counter")
    .html(`Questions${num ? ` ( ${num} )` : ""}`);

};

// Return the number of questions
const getNumQuestions = () => {

  return $("#add-questions").children().length;

};

// Display field errors, if any
const showError = (errorMsg) => {

  const errorComponent = $("#new-quiz-error");
  if (errorMsg) {
    errorComponent.html(errorMsg);
  } else {
    errorComponent.empty();
  }

};

// Check that the form is complete and that there are at least min questions/responses
// A quiz is valid if:
// - There are at least min questions
// - All questions are non-empty
// - All responses are non-empty
const getQuestionFormErrors = (minQuestions = 1, minResponses = 4) => {
  let error = null;
  const questions = $("#add-questions").children();
  // There must be at least 2 questions
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
    if (responses.length < minResponses) {
      error = `Minimum of ${minResponses} responses per question must be provided`;
      valid = false;
    }
    // Highlight question green/red if valid/invalid
    $(question).closest(".new-question").css("border-color", valid ? "#31f37b" : "#e22d4b");
  }

  return error;
};

// Check that the quiz info fields are complete
const getQuizFormErrors = () => {

  let error = null;
  const title = $("#quiz-title").val().trim();
  const desc = $("#quiz-desc").val().trim();
  const categoryIDs = ["1", "2", "3"];
  const category = $("#quiz-category").val().trim();
  const publicValues = ["true", "false"];
  const visibility = $("#quiz-visibility").val().trim();

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

// Submit form handler
const submitForm = () => {
  const title = $("#quiz-title").val().trim();
  const description = $("#quiz-desc").val().trim();
  const category_id = $("#quiz-category").val().trim();
  const public = $("#quiz-visibility").val().trim();
  const questions = [];
  const allQuestions = $(".input-question");
  for (const questionField of allQuestions) {
    const questionValue = $(questionField).val().trim();
    const responseFields = $(questionField).next().find(".input-response");
    const responseValues = [];
    for (const responseField of responseFields) {
      const responseValue = $(responseField).val().trim();
      const answer = { body: responseValue, explanation: "why tho D:" };
      responseValues.push(answer);
    }
    const question = {
      body: questionValue,
      answers: responseValues
    }
    questions.push(question);
  }
  const data = {
    title,
    description,
    category_id,
    public,
    questions
  };

  // console.log(data);

  // Submit a post request with the quiz data
  $.ajax({
    url: "/quizzes",
    type: "POST",
    data
  })
    .then(res => console.log("AJAX REQUEST WORKED! DATA FROM SERVER: ", res));

  ;

};

$(document).ready(function() {

  const questionsList = $("#add-questions");
  const addQuestionBtn = $(".icon-add");
  const quizForm = $("#new-quiz-form");


  // Add initial question forms
  const initialForms = 1;
  for (let i = 0; i < initialForms; i++) {
    addQuestionComponent(questionsList);
  }

  // Add a new question when the user clicks the + add question button
  addQuestionBtn.on("click", function() {
    addQuestionComponent(questionsList);
  });

  quizForm.on("submit", function(event) {
    event.preventDefault();
    console.log("SUBMITTING QUIZ (CLIENT-SIDE)...");
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