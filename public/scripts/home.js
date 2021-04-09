// Wrap the console message with a span tag and color class
const wrapper = (string) => {
  let msg = string;
  let className = "system";
  if (msg.startsWith("@ahhreggi > ")) {
    className = "ahhreggi";
  } else if (msg.startsWith("@pladd > ")) {
    className = "pladd";
  } else if (msg.startsWith("//")) {
    className = "comment";
  } else if (msg.startsWith("@InquizitorApp > ")) {
    className = "app";
  }
  return `<span class="${className}">${msg}</span>`;
};

// Animate the dev log console using a list of messages
const type = (messages, container, scroll = 0, delay = 500, repeat = 100) => {

  $("#console").empty();

  let feed = [];
  for (let i = 0; i < repeat; i++) {
    feed.push(...messages);
  }

  if (repeat >= 100) {
    feed.push(wrapper("@ahhreggi > no, it doesn't actually go on forever haha"));
  }

  let count = 0;
  let wait = 1000;
  for (const msg of feed) {
    if (terminate) break;
    queue.push(setTimeout(() => {
      container.append(wrapper(msg));
      count++;
      if (scroll && count > scroll) {
        container.find(":first-child").remove();
      }
    }, wait));
    wait += delay;
  }
};

let queue = [];
let terminate = false;

$(document).ready(function() {

  // Load cover photos
  loadCoverPhotos();

  // DevLog shenanigans :)
  const msgs = [
    "@InquizitorApp > Welcome to InquizitorApp v13.33.37.",
    "Type \".help\" for more information.",
    "@ahhreggi > .help",
    "@InquizitorApp > sike",
    "@pladd > \"hello world!\"",
    "'hello world!'",
    "@ahhreggi > \"hello world!\"",
    "'goodbye world!'",
    "@ahhreggi > wait a minute-",
    "-bash: wait: `a': not a pid or valid job spec",
    "-bash: wait: `minute-': not a pid or valid job spec",
    "@ahhreggi > git add .",
    "@ahhreggi > git commit -m \"time to sleep\"",
    "@ahhreggi > git checkout main",
    "Already on 'main'",
    "@ahhreggi > i swear i wasn't on main",
    "yes you were",
    "@ahhreggi > oh god",
    "oh: command not found",
    "@ahhreggi > sleep",
    "sleep: missing operand",
    "Try 'sleep' for more information.",
    "@ahhreggi > sleep",
    "@InquizitorApp > no",
    "@ahhreggi > 'sleep'",
    "@InquizitorApp > no",
    "@ahhreggi > PLEASE",
    "@InquizitorApp > no",
    "@ahhreggi > yes",
    "@InquizitorApp > no",
    "@ahhreggi > yes",
    "@InquizitorApp > NO",
    "@ahhreggi > YES",
    "@pladd > WHAT IS HAPPENING",
    "WHAT: command not found",
    "@ahhreggi > IDK MAN I'M TRYING TO SLEEP BUT IT WON'T LET ME",
    "IDK: command not found"
  ];

  const initial = [
    "@InquizitorApp > Welcome to InquizitorApp v3.1.21.",
    "// Live project: https://inquizitor-app.herokuapp.com/",
    "// Created by Reggi Sirilan (@ahhreggi) & Paul Ladd (@pladd).",
    "Type \".help\" for more information."
  ];

  const $console = $("#console");

  type(initial, $console, 13, 150, 1);

  let help = ".help";
  let sleep = "sleep";
  let i = 0;

  let helped = false;

  $(document).on("keydown", function(event) {
    const pressed = event.originalEvent.key;
    console.log(pressed);

    if (helped) {
      if (pressed === sleep[i]) {
        i++;
      } else {
        i = 0;
      }
      console.log(i);
      if (i === sleep.length) {
        terminate = true;
        for (const timeout of queue) {
          clearTimeout(timeout);
        }
        helped = false;
        terminate = false;
        type(initial, $console, 13, 50, 1);
        i = 0;
      }
    }

    if (!helped) {

      if (pressed === help[i]) {
        i++;
      } else {
        i = 0;
      }
      if (i === help.length) {
        helped = true;
        type(msgs, $console, 15, 300, 100);
        i = 0;
      }

    }

  });

  // Stop the devLog animation if the user scrolls down
  $(document).on("scroll", function() {

    const position = $(this).scrollTop();

    if (helped && (position + $(window).height() + 100 > $(this).height())) {
      terminate = true;
      for (const timeout of queue) {
        clearTimeout(timeout);
      }
      helped = false;
      terminate = false;
      type(initial, $console, 13, 50, 1);
      i = 0;
    }

  });

});