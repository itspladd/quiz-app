// Retrieve quizInfo from EJS variables
const getEJSData = () => {

  const quizData = {};
  const ejsQuizData = $("#data-ejs .data-quiz-key");
  for (const dataKey of ejsQuizData) {
    const key = $(dataKey).attr("title");
    const value = $(dataKey).html();
    quizData[key] = value;
  }

  const userData = {};
  const ejsUserData = $("#data-ejs .data-user-key");
  for (const dataKey of ejsUserData) {
    const key = $(dataKey).attr("title");
    const value = $(dataKey).html();
    userData[key] = value;
  }

  const sessionData = {};
  const ejsSessionData = $("#data-ejs .data-session-key");
  for (const dataKey of ejsSessionData) {
    const key = $(dataKey).attr("title");
    const value = $(dataKey).html();
    sessionData[key] = value;
  }

  return { quizData, userData, sessionData };

};

$(document).ready(function() {

  // quizData: author_id, category_id, description, id, title
  // userData: id, username
  // sessionData: end_time, id, responses, start_time
  // sessionData.responses: { question, answer, is_correct }

  // Get quiz, user, and session info from EJS
  const { quizData, userData, sessionData } = getEJSData();







})