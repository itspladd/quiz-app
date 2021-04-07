const loadCoverPhotos = () => {
  // Select all quiz list items
  const quizzes = $(".list-quiz");

  for (const quiz of quizzes) {
    // Retrieve cover photo URL
    const quizData = JSON.parse($(quiz).attr("data-quiz-data"));

    const url = quizData.coverphoto_url;

    // Set cover photo as the background image if it exists
    if (url) {
      console.log(url)
      $(quiz)
        .css("background-image", `url("${url}")`);
    } else {
      // Otherwise, set cover photo based on category --> this ideally should never happen
      const categoryID = quizData.category_id;
      const coverPhotos = {
        "1": "https://i.imgur.com/MUEFC2O.jpg",
        "2": "https://i.imgur.com/kTcMTv5.jpg",
        "3": "https://i.imgur.com/Zr3TESE.jpg"
      }
      $(quiz)
        .css("background-image", `url("${coverPhotos[categoryID]}")`);
    }
  }



};

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
      loadCoverPhotos();
    }

  });

  // Switch to My History tab
  $("#tab-history").on("click", function() {
    if (currentTab !== historyTab) {
      selectTab(historyTab, historyContent);
      unselectTab(currentTab, currentContent);
      currentTab = historyTab;
      currentContent = historyContent;
      loadCoverPhotos();
    }
  });

  // Switch to My Favorites tab
  $("#tab-favorites").on("click", function() {
    if (currentTab !== favoritesTab) {
      selectTab(favoritesTab, favoritesContent);
      unselectTab(currentTab, currentContent);
      currentTab = favoritesTab;
      currentContent = favoritesContent;
      loadCoverPhotos();
    }
  });

});