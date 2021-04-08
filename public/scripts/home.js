$(document).ready(function() {

  // Load cover photos
  loadCoverPhotos();

  // Array of featured quizzes
  const quizData = JSON.parse($(ejs).attr("data-quiz-data"));

  console.log(quizData);

  // Show only 3 quizzes at a time

});