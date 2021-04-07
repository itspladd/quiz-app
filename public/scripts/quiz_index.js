// Display quizzes with the given category title
const filterData = (data, category) => {

  // Set section title
  $("#main-title").html(category);

  // Clear browser component
  const $browser = $("#quiz-browser");
  $browser.empty();

  // Filter quizzes by the specified category
  const filteredData = data.filter(quiz => quiz.category_title === category || category === "All Quizzes");

  // Create quiz list items
  for (const quiz of filteredData) {
    const $quizItem = $(`
      <a href="/quizzes/${quiz.id}">
        <div class="d-flex flex-row justify-content-between align-items-center list-quiz">
          <div class="col-8">
            <p class="quiz-title mb-0 mt-0">${quiz.title}</p>
            <p class="quiz-desc d-none d-xl-inline">${quiz.description}</p>
            <p class="quiz-author d-none d-md-block my-1 text-muted">Submitted by ${quiz.author}</p>
          </div>
          <img class="quiz-go pr-3" src="/images/arrow-green.png" alt="arrow" />
        </div>
      </a>
    `);

    // Add quiz to browser container
    $browser.append($quizItem);
  }

  // If there are no quizzes for a category, display a link to create one
  if (!filteredData.length) {
    const $message = $(`
      <p class="lead">There aren't any quizzes for this category yet. :(</p>
      <a href="/quizzes/new">
        <button type="button" class="btn-custom btn-custom-blue mr-2">
          Create Quiz
        </button>
      </a>
    `);

    // Add message to browser container
    $browser.append($message);
  }


};

$(document).ready(function() {

  // Get EJS data
  const quizData = JSON.parse($("#ejs").attr("data-ejs"));

  let category = "All Quizzes";

  // Show all quizzes initially
  filterData(quizData, category);

  // When a tab is clicked, filter quizzes by its associated category
  $(".tab-btn").on("click", function(event) {

    const $target = $(event.target);
    if ($target.is("#tab-all")) {
      category = "All Quizzes"
    } else if ($target.is("#tab-tech")) {
      category = "Technology"
    } else if ($target.is("#tab-gaming")) {
      category = "Gaming"
    } else if ($target.is("#tab-edu")) {
      category = "Education"
    }

    filterData(quizData, category);

  })

});