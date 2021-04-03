// Load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt");
const morgan = require("morgan");

// Import db helper functions
const db = require("./src/lib/dbHelpers.js");

// app.use(morgan("dev"));

app.set("view engine", "ejs");
app.set("views","./src/views");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes for each resource
const usersRoutes = require("./src/routes/users");
const quizzesRoutes = require("./src/routes/quizzes");

// Mount resource routes
app.use("/users", usersRoutes(db));
app.use("/quizzes", quizzesRoutes(db));

// Homepage
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/404", (req, res) => {
  res.render("404");
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/*", (req, res) => {
  res.redirect("/404");
});

app.post("/register", (req, res) => {
  // Extract/convert data
  const {
    username,
    email,
    password
  } = req.body;

  // TODO: Check if user exists then run code below IF username/email isn't taken
  const existingData = false; // false or "username" or "email" if either is taken

  // ERROR: Incomplete form or existing credentials
  if (!username || !email || !password) {
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

app.listen(PORT, () => {
  console.log(`InquizitorApp listening on port ${PORT}`);
});