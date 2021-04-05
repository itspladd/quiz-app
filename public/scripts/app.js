// Remove an element
const removeElement = (element, delay = 800) => {
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
    element.remove();
  }, delay);
};

// Add an element
const addElement = (element, delay = 400) => {
  element.css("display", "none");
  setTimeout(() => {
    element
      .slideDown(delay)
      // .css("display", "block")
      .css("opacity", 0)
      .animate({
        queue: true,
        opacity: 1
      }, {
        duration: delay
      });
  }, 0);
};

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

});