require("dotenv").config();

let dbParams = {};
if (process.env.DATABASE_URL) {
  dbParams.connectionString = process.env.DATABASE_URL;
} else {
  dbParams = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  };
}

//console.log(dbParams);

const { Pool } = require('pg');
const pool = new Pool(dbParams);

module.exports = {
  query: (text, params) => {
    return pool.query(text, params)
    .then(res => res.rows)
    .catch(err => console.error(err));
  }
};