const wrapper = (string) => {
  let msg = string;
  let className = "system";
  if (msg.startsWith("@ahhreggi > ")) {
    className = "ahhreggi"
  } else if (msg.startsWith("@pladd > ")) {
    className = "pladd"
  } else if (msg.startsWith("//")) {
    className = "comment"
  }
  return `<span class="${className}">${msg}</span>`;
}

const type = (messages, container, scroll = 0, delay = 500, repeat = 100) => {
  let feed = [];
  for (let i = 0; i < repeat; i++) {
    feed.push(...messages)
  }
  feed.push(wrapper("@ahhreggi > no, it doesn't actually go on forever haha"));
  let count = 0;
  let wait = 1000;
  for (const msg of feed) {
    setTimeout(() => {
      container.append(wrapper(msg));
      count++;
      if (scroll && count > scroll) {
        container.find(":first-child").remove();
      }
    }, wait)
    wait += delay;
  }
}

$(document).ready(function() {

  // Load cover photos
  loadCoverPhotos();

  const msgs = [
    `@ahhreggi > inquizitorapp -v`,
    "v13.13.37",
    `@pladd > "hello world!"`,
    "'hello world!'",
    `@ahhreggi > "hello world!"`,
    "'goodbye world!'",
    "@ahhreggi > wait a minute-",
    "-bash: wait: `a': not a pid or valid job spec",
    "-bash: wait: `minute-': not a pid or valid job spec",
    `@ahhreggi > git add .`,
    `@ahhreggi > git commit -m 'time to sleep'`,
    `@ahhreggi > git checkout main`,
    `Already on 'main'`,
    `@ahhreggi > oh god`,
    `oh: command not found`,
    `@ahhreggi > sleep`,
    `sleep: missing operand`,
    `Try 'sleep --help' for more information.`,
    `@ahhreggi > no`,
    `yes`,
    `@ahhreggi > no`,
    `yes`,
    `@ahhreggi > no`,
    `yes`,
    `@ahhreggi > no`,
    `yes`,
    `@ahhreggi > no`,
    `yes`,
    `@pladd > WHAT IS HAPPENING`
    `WHAT: command not found`,
  ]

  const $comp = $("#console");
  type(msgs, $comp, 15);

});