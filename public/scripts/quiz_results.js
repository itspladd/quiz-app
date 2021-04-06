// Copy the given string to the clipboard
const copyText = (str) => {
  const $temp = document.createElement("textarea");
  $temp.value = str;
  document.body.appendChild($temp);
  $temp.select();
  document.execCommand("copy");
  document.body.removeChild($temp);
};

$(document).ready(function() {

  let revert;

  $("#share-btn").on("click", function() {

    // Clear any previous timeouts
    clearTimeout(revert);

    const button = $(this);

    // Copy results link to clipboard
    copyText(window.location.href);

    // Change share button appearance
    button.addClass("btn-custom-blue");
    button.html("Link copied!");

    // Revert appearance after 2 seconds
    revert = setTimeout(() => {
      button.removeClass("btn-custom-blue");
      button.html("Share this page");
    }, 2000);

  });

  $(".results-response").on("click", function() {
    const isCorrect = $(this).find(".results-correctness").html().trim() === "CORRECT";
    if (!isCorrect) {
      $(this).find(".results-actual").removeClass("d-none");
    }
  })

});