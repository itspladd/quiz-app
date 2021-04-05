// Appends a question component to the given element
const addQuestionComponent = (element) => {

  const $newForm = $(`
    <div class="form-group new-question d-flex flex-column">
      <header class="d-flex flex-row justify-content-between">
        <label for="question" class="question-label form-label text-muted mt-2">Question</label>
        <span class="toggle minimize text-muted">click to minimize</span>
      </header>
      <input class="input-question form-control" type="text" name="question" maxlength="250" required>
      <div class="responses">
        <label for="answer" class="form-label text-muted mt-2">Correct Answer</label>
        <input class="input-response form-control" type="text" name="answer[]" maxlength="250" required>
        <label for="answer" class="form-label text-muted mt-2">Incorrect Answers</label>
        <input class="input-response form-control" type="text" name="answer[]" maxlength="250" required>
        <input class="input-response form-control mt-3" type="text" name="answer[]" maxlength="250" required>
        <input class="input-response form-control mt-3" type="text" name="answer[]" maxlength="250" required>
      </div>
      <div class="question-control d-flex flex-row justify-content-end mt-3">
        <div class="d-flex flex-row align-items-center">
          <span class="control-desc control-del">Delete </span><span class="icon icon-del"></span>
        </div>
      </div>
    </div>
  `);

  // Add delete button click event handler
  const deleteBtn = $newForm.find(".icon-del");
  $(deleteBtn).bind("click", function() {
    const component = $(this).closest(".new-question");
    removeElement(component);
    setTimeout(() => {
      updateCounter();
    }, 800);
    // Update counter
  });

  $($newForm).bind("click", function(event) {
    const $target = $(event.target);
    const clicks = $(this).data("clicks");
    if ($($target).is(".toggle.maximize")) {
      $(this)
        .find(".responses")
        .slideDown();
      $(this)
        .find(".toggle")
        .html("click to minimize")
        .removeClass("maximize")
        .addClass("minimize");
    } else if ($($target).is(".toggle.minimize")) {
      $(this).find(".responses").slideUp();
      $(this)
        .find(".toggle")
        .html("click to maximize")
        .removeClass("minimize")
        .addClass("maximize");
    }
    $(this).data("clicks", !clicks);
  });

  // Add form to all questions container
  $newForm.css("display", "none").css("min-height", "0");
  element.append($newForm);
  addElement($newForm);

  // Update counter
  updateCounter();

};

// Remove an element
const removeElement = (element, delay = 800) => {
  element
    .css("min-height", "0")
    .animate({
      queue: true,
      opacity: 0
    }, {
      duration: 400
    })
    .slideUp(400);
  setTimeout(() => {
    element.remove();
  }, delay);
};

// Add an element
const addElement = (element, delay = 400) => {
  element.css("display", "none");
  setTimeout(() => {
    element
      .slideDown(delay)
      // .css("display", "block")
      .css("opacity", 0)
      .animate({
        queue: true,
        opacity: 1
      }, {
        duration: delay
      });
  }, 0);
};

// Update the question counter
const updateCounter = () => {

  const num = getNumQuestions();
  $("#questions-counter")
    .html(`Questions${num ? ` ( ${num} )` : ""}`);
  updateLabels();

};

// Update question # labels
const updateLabels = () => {

  let number = 1;
  for (const component of $(".question-label")) {
    console.log($(component).html(`Question #${number}`));
    number++;
  }

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

// Check that the form is complete and that there are sufficient questions and responses
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

// Sanitize user input values
const sanitize = (string) => {

  // const div = document.createElement("div");
  // div.appendChild(document.createTextNode(string.trim()));
  // return div.innerHTML;
  return string.trim();

};

// Submit form handler
const submitForm = () => {

  const title = sanitize($("#quiz-title").val());
  const description = sanitize($("#quiz-desc").val());
  const category_id = sanitize($("#quiz-category").val());
  const public = sanitize($("#quiz-visibility").val());
  const questions = [];
  const allQuestions = $(".input-question");
  for (const questionField of allQuestions) {
    const questionValue = sanitize($(questionField).val());
    const responseFields = $(questionField).next().find(".input-response");
    const responseValues = [];
    for (const responseField of responseFields) {
      const responseValue = sanitize($(responseField).val());
      const answer = { body: responseValue, explanation: "why tho D:" };
      responseValues.push(answer);
    }
    const question = {
      body: questionValue,
      answers: responseValues
    };
    questions.push(question);
  }

  const data = {
    title,
    description,
    category_id,
    public,
    questions
  };

  // Submit a post request with the quiz data
  $.ajax({
    url: "/quizzes",
    type: "POST",
    data
  })
    .then(quizID => {
      // On successful quiz submission, redirect to the new quiz show page
      window.location.replace(`/quizzes/${quizID}`);
    });

};

$(document).ready(function() {

  const questionsList = $("#add-questions");
  const addQuestionBtn = $(".icon-add");
  const quizForm = $("#new-quiz-form");

  // Add initial question forms
  const initialForms = 0;
  for (let i = 0; i < initialForms; i++) {
    addQuestionComponent(questionsList);
  }

  // Add a new question when the user clicks the + add question button
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

  let hoverDelay;

});