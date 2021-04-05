$(document).ready(function() {

  const scrollBtn = $("#scroll-btn");

  scrollBtn.on("click", function() {
    $(document).scrollTop(0)
  })

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
  })

});