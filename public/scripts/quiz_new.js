// Appends a question component to the given element
const addQuestionComponent = (element) => {
  const $newForm = $(`
    <div class="form-group new-question">
        <label for="question" class="form-label text-muted mt-2">Question</label>
        <input class="input-question form-control" type="text" name="question" required>
        <div class="responses">
          <label for="answer" class="form-label text-muted mt-2">Correct Answer</label>
          <input class="input-response form-control" type="text" name="answer[]" required>
          <label for="answer" class="form-label text-muted mt-2">Incorrect Answers</label>
          <input class="input-response form-control" type="text" name="answer[]" required>
          <input class="input-response form-control mt-3" type="text" name="answer[]" required>
          <input class="input-response form-control mt-3" type="text" name="answer[]" required>
        </div>
        <div class="add-control d-flex flex-row align-items-center mt-3">
          <span class="icon icon-del"></span><span class="control-desc control-del">Delete</span>
        </div>
      </div>
    </div>
  `);
  // Add delete button click event handler
  const deleteBtn = $newForm.find(".icon-del");
  $(deleteBtn).bind("click", function() {
    $(this).closest(".new-question").remove();
    console.log("DELETED")
    // Update counter
    updateCounter();
  })
  // Add form to all questions container
  element.append($newForm);
  // Update counter
  updateCounter();
}

// Update the children counter of the given element
const updateCounter = () => {
  const num = getNumQuestions();
  $("#questions-counter")
    .html(`Questions${num ? ` ( ${num} )` : ""}`)
};

// Return the number of questions
const getNumQuestions = () => {
  return $("#add-questions").children().length;
};

// Check that the form is complete and that there are at least min questions
// A quiz is valid if:
// - There are at least min questions
// - All questions are non-empty
// - All responses are non-empty
const checkForm = (min = 1) => {
  let error = null;
  const questions = $("#add-questions").children();
  // There must be at least 2 questions
  if (questions.length < min) {
    error = "Must include at least 2 questions"
  }
  const allQuestions = $(".input-question")
  for (const question of allQuestions) {
    let valid = true;
    const userQuestion = $(question).val().trim();
    if (userQuestion.length < 1) {
      error = "Question field may not be empty"
      valid = false;
    }
    const responses = $(question).next().find(".input-response");
    for (const response of responses) {
      const userResponse = $(response).val().trim();
      if (userResponse.length < 1) {
        error = "Response field may not be empty"
        valid = false;
      }
    }
    // Highlight question green/red if valid/invalid
    $(question).closest(".new-question").css("border-color", valid ? "#31f37b" : "#e22d4b");
  }
  return error || true;
}

$(document).ready(function() {

  const questionsList = $("#add-questions");
  const addQuestionBtn = $(".icon-add");


  // Add initial question forms
  const initialForms = 1;
  for (let i = 0; i < initialForms; i++) {
    addQuestionComponent(questionsList);
  }

  // Add a new question when the user clicks the + add question button
  addQuestionBtn.on("click", function() {
    addQuestionComponent(questionsList);
  });

  $("#new-quiz-form").on("submit", function(event) {
    event.preventDefault();
    console.log("SUBMITTING QUIZ...")
    console.log(checkForm());
  })

});