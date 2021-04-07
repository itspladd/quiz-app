const selectTab = (tab, content) => {

  $(tab).addClass("active-tab");
  $(content).removeClass("d-none");

};

const unselectTab = (tab, content) => {

  $(tab).removeClass("active-tab");
  $(content).addClass("d-none")

}

// // Send a DELETE request to the server with the given quiz ID
// const deleteQuiz = (quizID) => {
//   $.ajax({
//     url: `/quizzes/${quizID}`,
//     type: "DELETE",
//     data: quizID
//   })
// }

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

  // // Delete a quiz
  // $(".delete-quiz").on("click", function() {

  //   const quizID = $(this).attr("data-id");

  //   // Submit a delete request to the server with the given quiz ID
  //   // deleteQuiz(quizID);


  // })


});