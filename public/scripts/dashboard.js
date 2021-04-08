const loadCoverPhotos = () => {

  // Select all quiz list items
  const quizzes = $(".list-quiz");

  for (const quiz of quizzes) {
    // Retrieve cover photo URL
    const quizData = JSON.parse($(quiz).attr("data-quiz-data"));
    let url = quizData.coverphoto_url;

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // If there is no url, set cover photo based on category --> this ideally should never happen
    // once fixed, this if block is no longer necessary, then change url to const
    if (!url) {
      console.log("coverphoto url not found for a quiz in dashboard meaning the query returned null");
      const categoryID = quizData.category_id;
      const coverPhotos = {
        "1": "https://i.imgur.com/MUEFC2O.jpg",
        "2": "https://i.imgur.com/kTcMTv5.jpg",
        "3": "https://i.imgur.com/Zr3TESE.jpg"
      }
      url = coverPhotos[categoryID];
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////

    // Set cover photo as the background image
    $(quiz)
      .css("backdrop-filter", "blur(10px)")
      .css("background-image", `url("${url}")`)

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