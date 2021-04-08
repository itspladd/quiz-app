$(document).ready(function() {

  const quizTab = $("#tab-quizzes");
  const quizContent = $("#user-quizzes");

  const historyTab = $("#tab-history");
  const historyContent = $("#user-history");

  const favoritesTab = $("#tab-favorites");
  const favoritesContent = $("#user-favorites");

  let currentTab = quizTab;
  let currentContent = quizContent;

  // Load quiz cover photos
  loadCoverPhotos();

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

  // Switch to My Favorites tab
  $("#tab-favorites").on("click", function() {
    if (currentTab !== favoritesTab) {
      selectTab(favoritesTab, favoritesContent);
      unselectTab(currentTab, currentContent);
      currentTab = favoritesTab;
      currentContent = favoritesContent;
    }
  });

});