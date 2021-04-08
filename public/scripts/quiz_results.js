$(document).ready(function() {

  $(".results-response").on("click", function() {
    const isCorrect = $(this).find(".results-correctness").html().trim() === "CORRECT";
    if (!isCorrect) {
      $(this).find(".results-actual").removeClass("d-none");
    }
  });

});