$(document).ready(function() {

  // Load cover photos
  loadCoverPhotos();

  // Array of featured quizzes
  const quizData = JSON.parse($(ejs).attr("data-quiz-data"));

  const consoleComp = $("#console");

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
      consoleComp.append(msg);
    }, delay);
    delay += 1000
  }

});