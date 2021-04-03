// Load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
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
  const newUser = {...req.body};
  // Encrypt password
  newUser.password = newUser.password + "encrypted!!!";
  db.addUser(newUser)
  .then(res.redirect("/"))
  .catch(err => console.error(err));
});

app.listen(PORT, () => {
  console.log(`ExQuizzIt listening on port ${PORT}`);
});