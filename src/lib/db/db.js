require("dotenv").config();

let dbParams = {  ssl: {
  rejectUnauthorized: false
}};
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
console.log("**********************************")
console.log("IN DB.JS")
console.log("dbPARAMS:")
console.log(dbParams)
console.log("**********************************")
const { Pool } = require('pg');
const pool = new Pool(dbParams);
pool.connect();

module.exports = {
  query: (queryString, queryParams) => {
    console.log("Querying...");
    console.log(queryString);
    console.log(queryParams);
    return pool.query(queryString, queryParams)
    .then(res => {
      console.log('returning: ', res.rows )
      return res.rows;
    })
    .catch(err => console.log(err));
  },

  /**
   * Build the data needed to insert a new object into the database.
   * @param  {Object} object
   *         The data to be added.
   * @return {Object}
   *         The column names, query variables, and query parameters.
   *
   * Build your queryString with `INSERT INTO [table] (${columns}) VALUES (${vars})`
   * The run db.query with (queryString, queryParams).
   *
   */
  buildInsertQueryParams: function(obj) {
    const keysArray = Object.keys(obj);
    const numVars = keysArray.length;
    const queryParams = Object.values(obj);

    columns = keysArray.join(", ");
    let vars = "";
    for(let i = 1; i <= numVars; i++) {
      vars += i !== 1 ? ", " : "";
      vars += `$${i}`;
    }

    return {columns, vars, queryParams};
  }
};