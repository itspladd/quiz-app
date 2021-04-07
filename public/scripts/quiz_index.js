$(document).ready(function() {

  const quizTab = $("#tab-quizzes");
  const historyTab = $("#tab-history");
  const quizContent = $("#user-quizzes");
  const historyContent = $("#user-history");
  let currentTab = quizTab;
  let currentContent = quizContent;

  // Switch to My Quizzes tab (default)
  $("#tab-quizzes").on("click", function() {
    if (currentTab !== quizTab) {
      selectTab(quizTab, quizContent);
      unselectTab(currentTab, currentContent);
      currentTab = quizTab;
      currentContent = quizContent;
    }

  });

  // Switch to My History tab
  $("#tab-history").on("click", function() {
    if (currentTab !== historyTab) {
      selectTab(historyTab, historyContent);
      unselectTab(currentTab, currentContent);
      currentTab = historyTab;
      currentContent = historyContent;
    }
  });

});