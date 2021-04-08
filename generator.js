const db = ("./src/lib/db/db.js");

const quiz = `{"author_id":"1","title":"World Capitals","description":"Do you know all the capitals of the world?","category_id":"3","public":"true","questions":[{"body":"What is the capital of Canada?","answers":[{"body":"Ottawa"},{"body":"Toronto"},{"body":"Quebec City"},{"body":"Vancouver"}]},{"body":"What is the capital of the U.S.?","answers":[{"body":"Washington, D.C."},{"body":"New York City"},{"body":"Los Angeles"},{"body":"Honolulu"}]}]}`;

db.addQuiz(quiz)