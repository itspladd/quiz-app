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
    button.html("Link copied!")
      .removeClass("btn-custom-blue")
      .addClass("btn-custom-white")

    // Revert appearance after 2 seconds
    revert = setTimeout(() => {
      button.html("Share this page")
        .removeClass("btn-custom-white")
        .addClass("btn-custom-blue")
    }, 2000);

  });

  const console = $("#console");

  const messages = [
    "<span class='pladd'>@pladd > Hello world!</span>",
    "<span class='ahhreggi'>@ahhreggi > hey paul i think the trending panel is broken pls fix, ty!</span>",
    "<span class='ahhreggi'>@ahhreggi > btw check out the quiz show page</span>",
    "<span class='ahhreggi'>@ahhreggi > also coverphoto urls aren't being sent to the dashboard properly (they're null)</span>",
    "<span class='ahhreggi'>@ahhreggi > to show ejs data, set if (!true) to true in _footer.ejs</span>",
    "<span class='ahhreggi'>@ahhreggi > p.s. databases make me cri</span>",
    "<span class='ahhreggi'>@ahhreggi > inquizitorapp -v</span>",
    "<span class='system'>v13.33.7</span>",
    "<span class='ahhreggi'>@ahhreggi > this is cool</span>",
    "<span class='ahhreggi'>@ahhreggi > git add .</span>",
    "<span class='ahhreggi'>@ahhreggi > git commit -m 'time to sleep'</span>",
    "<span class='ahhreggi'>@ahhreggi > git push</span>",
    "<span class='ahhreggi'>@ahhreggi > git checkout main</span>",
    "<span class='system'>Already on 'main'</span>",
    "<span class='ahhreggi'>@ahhreggi > oh god</span>",
    "<span class='system'>oh: command not found</span>",
    "<span class='ahhreggi'>@ahhreggi > sleep</span>",
    "<span class='system'>sleep: missing operand</span>",
    "<span class='system'>Try 'sleep --help' for more information.</span>",
    "<span class='system'>no</span>"
  ];

  for (let i = 0; i < 1000; i++) {
    messages.push("<span class='system'>no</span>");
  }

  let delay = 1000;
  for (const msg of messages) {
    setTimeout(() => {
      console.append(msg);
    }, delay);
    delay += 1000
  }

});