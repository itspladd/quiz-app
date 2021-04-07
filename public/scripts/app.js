// Remove an element
const removeElement = (element, delay = 800, temporary = false) => {
  element
    .css("min-height", "0")
    .animate({
      queue: true,
      opacity: 0
    }, {
      duration: 400
    })
    .slideUp(400);
  setTimeout(() => {
    if (temporary) {
      element.css("display", "none");
    } else {
      element.remove();
    }
  }, delay);
};

// Add an element
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

// Unselect a content tab and hide its content
const unselectTab = (tab, content) => {

  $(tab).removeClass("active-tab");
  $(content).addClass("d-none")

}

$(document).ready(function() {

  const scrollBtn = $("#scroll-btn");

  scrollBtn.on("click", function() {
    $(document).scrollTop(0);
  });

  $(document).on("scroll", function() {
    const position = $(this).scrollTop();
    // Show the scroll-to-top button when the user scroll's below a certain position
    if (position > 250) {
      scrollBtn
        .css("visibility", "visible")
        .fadeIn(200);
    } else {
      scrollBtn.fadeOut(200);
    }
  });

  let revert;

  $("#share-btn").on("click", function() {

    // Clear any previous timeouts
    clearTimeout(revert);

    const button = $(this);

    // Copy results link to clipboard
    copyText(window.location.href);

    // Change share button appearance
    button.addClass("btn-custom-blue");
    button.html("Copied!");

    // Revert appearance after 2 seconds
    revert = setTimeout(() => {
      button.removeClass("btn-custom-blue");
      button.html("Share Link");
    }, 2000);

  });

});