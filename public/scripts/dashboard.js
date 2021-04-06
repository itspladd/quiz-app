const showTab = (tab) => {

  $(tab).removeClass("d-none");

};

const hideTab = (tab) => {

  $(tab).addClass("d-none");

}

$(document).ready(function() {

  const userQuizzes = $("#user-quizzes");
  const userHistory = $("#user-history");
  let current = userQuizzes;

  // Switch to My Quizzes tab (default)
  $("#tab-quizzes").on("click", function() {
    if (current !== userQuizzes) {
      showTab(userQuizzes);
      hideTab(current);
      current = userQuizzes;
    }
  });

  // Switch to My History tab
  $("#tab-history").on("click", function() {
    if (current !== userHistory) {
      showTab(userHistory);
      hideTab(current);
      current = userHistory;
    }
  });


});