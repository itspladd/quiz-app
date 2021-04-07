
// Display quizzes with the given category title
const filterData = (data, category = "all") => {

  const $browser = $("#quiz-browser");

  // Clear browser
  $browser.empty();

  // Filter quizzes by the specified category
  const filteredData = data.filter(quiz => quiz.category_title === category || category === "all");

  for (const quiz of filteredData) {
    // Create quiz list item
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

};

$(document).ready(function() {

  // Get EJS data
  const quizData = JSON.parse($("#ejs").attr("data-ejs"));

  let category = "all";

  // Show all quizzes initially
  filterData(quizData, category);

  $(".tab-btn").on("click", function(event) {
    const $target = $(event.target);
    if ($target.is("#tab-all")) {
      category = "all"
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