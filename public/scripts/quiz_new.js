// Appends a question component to the given element
const addQuestionComponent = (element) => {
  const $newForm = $(`
    <div class="form-group new-question">
        <label for="question" class="form-label text-muted mt-2">Question</label>
        <input class="form-control" type="text" name="question" required>
        <div class="responses">
          <label for="answer" class="form-label text-muted mt-2">Correct Answer</label>
          <input class="form-control" type="text" name="answer[]" required>
          <label for="answer" class="form-label text-muted mt-2">Incorrect Answers</label>
          <input class="form-control" type="text" name="answer[]" required>
          <input class="form-control mt-3" type="text" name="answer[]" required>
          <input class="form-control mt-3" type="text" name="answer[]" required>
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

});