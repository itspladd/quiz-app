// Retrieve quizInfo from EJS variables
const getEJSData = () => {

  const quizInfo = {};
  const ejsQuizData = $("#data-ejs .data-quiz-key");
  for (const dataKey of ejsQuizData) {
    const key = $(dataKey).attr("title");
    const value = $(dataKey).html();
    quizInfo[key] = value;
  }

  const userInfo = {};
  const ejsUserData = $("#data-ejs .data-user-key");
  for (const dataKey of ejsUserData) {
    const key = $(dataKey).attr("title");
    const value = $(dataKey).html();
    userInfo[key] = value;
  }

  const sessionInfo = {};
  const ejsSessionData = $("#data-ejs .data-session-key");
  for (const dataKey of ejsSessionData) {
    const key = $(dataKey).attr("title");
    const value = $(dataKey).html();
    sessionInfo[key] = value;
  }

  return { quizInfo, userInfo, sessionInfo };

};