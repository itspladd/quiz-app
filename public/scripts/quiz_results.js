$(document).ready(function() {

  // Reveal the correct answer when an incorrect response log is clicked
  $(".results-response").on("click", function() {
    const isCorrect = $(this).find(".results-correctness").html().trim() === "CORRECT";
    if (!isCorrect) {
      $(this).find(".results-actual").removeClass("d-none");
    }
  });

});