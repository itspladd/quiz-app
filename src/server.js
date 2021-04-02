// Load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: "expanded"
}));
app.use(express.static("public"));

// Routes for each resource
const usersRoutes = require("./routes/users");
const quizzesRoutes = require("./routes/quizzes");

// Mount resource routes
app.use("/users", usersRoutes(db));
app.use("/quizzes", quizzesRoutes(db));

// Homepage

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`ExQuizzIt listening on port ${PORT}`);
});