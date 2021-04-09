/* eslint-disable */

// Remove an element with an animation
const removeElement = (element, delay = 800, temporary = false) => {
  element
    .css("min-height", "0")
    .animate({
      queue: true,
      opacity: 0
    }, {
      duration: 400
    })``
    .slideUp(400);
  setTimeout(() => {
    if (temporary) {
      element.css("display", "none");
    } else {
      element.remove();
    }
  }, delay);
};

// Add an element with an animation
const addElement = (element, delay = 400) => {
  element.css("display", "none");
  setTimeout(() => {
    element
      .slideDown(delay)
      .css("display", "block")
      .css("opacity", 0)
      .animate({
        queue: true,
        opacity: 1
      }, {
        duration: delay
      });
  }, 0);
};

// Copy the given string to the clipboard
const copyText = (str) => {
  const $temp = document.createElement("textarea");
  $temp.value = str;
  document.body.appendChild($temp);
  $temp.select();
  document.execCommand("copy");
  document.body.removeChild($temp);
};

// Select a tab and display its content
const selectTab = (tab, content) => {

  $(tab).addClass("active-tab");
  $(content).removeClass("d-none");

};

// Unselect a tab and hide its content
const unselectTab = (tab, content) => {

  $(tab).removeClass("active-tab");
  $(content).addClass("d-none");

};

// Load cover photos for all list quizzes
const loadCoverPhotos = () => {

  const quizzes = $(".list-quiz");
  for (const quiz of quizzes) {
    const quizData = JSON.parse($(quiz).attr("data-quiz-data"));
    const url = quizData.coverphoto_url;
    $(quiz)
      .css("background-image", `url("${url}")`);
  }

};

$(document).ready(function() {

  const scrollBtn = $("#scroll-btn");

  // Scroll to top when the user clicks the scroll-to-top button
  scrollBtn.on("click", function() {
    $(document).scrollTop(0);
  });

  // Display the scroll-to-top button when the user scroll's below a certain position
  $(document).on("scroll", function() {
    const position = $(this).scrollTop();
    if (position > 250) {
      scrollBtn
        .css("visibility", "visible")
        .fadeIn(200);
    } else {
      scrollBtn.fadeOut(200);
    }
  });

  let revert;

  // Copy the current page link and animate the share button appearance
  $("#share-btn").on("click", function() {

    clearTimeout(revert);
    const button = $(this);
    copyText(window.location.href);
    button.html("Link copied!")
      .removeClass("btn-custom-blue")
      .addClass("btn-custom-white");
    revert = setTimeout(() => {
      button.html("Share this page")
        .removeClass("btn-custom-white")
        .addClass("btn-custom-blue");
    }, 2000);
  });

});