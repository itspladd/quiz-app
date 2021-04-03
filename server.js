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
    userData: null, // userDatabase[cookieUserID]
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

// Log the user in
app.post("/login", (req, res) => {
  const {
    login,
    password
  } = req.body;
  let validUserData = true; // authenticateUser(login, password, userDatabase);
  // ERROR: Incomplete form
  if (!login || !password) {
    req.flash("danger", "Please complete all fields.");
    res.redirect("/login");
    // ERROR: Credentials are invalid
  } else if (!validUserData) {
    req.flash("danger", "The username/email or password you entered is invalid.");
    res.redirect("/login");
    // SUCCESS: Credentials are valid
  } else {
    req.session.userID = validUserData.id;
    req.flash("success", `Login successful. Welcome back, ${validUserData.username}!`);
    res.redirect("/");
  }
});

// Log the user out
app.post("/logout", (req, res) => {
  // SUCCESS: User is logged in
  if (req.session.userID) {
    req.session.userID = null;
    req.flash("success", "You've successfully logged out.");
  }
  res.redirect("/");
});

// Form to login to an existing account
app.get("/login", (req, res) => {
  const {
    alerts,
    userData,
    currentPage
  } = res.locals.vars;
  // ERROR: User is already logged in
  if (userData) {
    req.flash("warning", "You are already logged in.");
    res.redirect("/");
  } else {
    // SUCCESS: User is not logged in
    const templateVars = {
      alerts,
      userData,
      currentPage
    };
    res.render("login", templateVars);
  }
});

// Form to register a new account
app.get("/register", (req, res) => {
  const {
    alerts,
    userData,
    currentPage
  } = res.locals.vars;
  // ERROR: User is already logged in
  if (userData) {
    req.flash("warning", "You are already logged in.");
    res.redirect("/urls");
  } else {
    // SUCCESS: User is not logged in
    const templateVars = {
      alerts,
      userData,
      currentPage
    };
    res.render("register", templateVars);
  }
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
  const {
    alerts,
    userData,
    currentPage
  } = res.locals.vars;
  const templateVars = {
    alerts,
    userData,
    currentPage
  };
  res.render("404", templateVars);
});

// Home page
app.get("/", (req, res) => {
  const {
    alerts,
    userData,
    currentPage
  } = res.locals.vars;
  const templateVars = {
    alerts,
    userData,
    currentPage
  };
  res.render("index", templateVars);
});

// Wildcard route
app.get("/*", (req, res) => {
  res.redirect("/404");
});

//////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`InquizitorApp listening on port ${PORT}`);
});