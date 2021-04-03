const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const dayjs = require("dayjs");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 8080;

// HELPER FUNCTIONS //////////////////////////////////

const db = require("./src/lib/dbHelpers.js");
const {
  generateRandomString,
} = require("./src/lib/serverHelpers.js");

// MIDDLEWARE & CONFIGURATIONS ///////////////////////

app.set("view engine", "ejs"); // set the view engine to EJS
app.set("views","./src/views"); // set the views directory
app.use(bodyParser.urlencoded({ extended: true })); // parse req body
app.use(cookieSession({ // configure cookies
  name: "session",
  keys: ["userID", "visitorID"],
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(methodOverride("_method")); // override POST requests
app.use(express.static("public")); // serve public directory
app.use(flash()); // enable storage of flash messages

// Initialize local variables on every request
app.use((req, res, next) => {
  if (!req.session.visitorID) {
    req.session.visitorID = generateRandomString(10);
  }
  const visitorID = req.session.visitorID;
  const cookieUserID = req.session.userID;
  const currentDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  res.locals.vars = {
    alerts: req.flash(),
    visitorID,
    userData: userDatabase[cookieUserID],
    currentPage: req.originalUrl,
    currentDateTime
  };
  next();
});

// RESOURCE ROUTES ///////////////////////////////////
const usersRoutes = require("./src/routes/users");
const quizzesRoutes = require("./src/routes/quizzes");

app.use("/users", usersRoutes(db));
app.use("/quizzes", quizzesRoutes(db));

// ENDPOINTS & ROUTES ////////////////////////////////

// Form to login to an existing account
app.get("/login", (req, res) => {
  res.render("login");
});

// Form to register a new account
app.get("/register", (req, res) => {
  res.render("register");
});

// Create a new account and log the user in
app.post("/register", (req, res) => {
  const {
    username,
    email,
    password
  } = req.body;
  // TODO: Check if user exists then run code below IF username/email isn't taken
  const existingData = false; // DB helper returns: false or "username" or "email" if either is taken
  // ERROR: Incomplete form or existing credentials
  if (!username || !email || !password) {
    // req.flash("danger", "Please complete all fields.");
    res.redirect("/register");
  } else if (existingData) {
    // req.flash("danger", `The ${existingData} you entered is already in use.`);
    res.redirect("/register");
  } else {
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.addUser({ username, email, password: hashedPassword })
    .then(() => {
      // req.flash("Registration successful. Welcome to InquizitorApp!");
      console.log("Registration successful. Welcome to InquizitorApp!");
      res.redirect("/")
    })
    .catch(err => console.error(err));
  }
});

// Error 404 page
app.get("/404", (req, res) => {
  res.render("404");
});

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Wildcard route
app.get("/*", (req, res) => {
  res.redirect("/404");
});

//////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`InquizitorApp listening on port ${PORT}`);
});