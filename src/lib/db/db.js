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

const { Pool } = require('pg');
const pool = new Pool(dbParams);

module.exports = {
  query: (queryString, queryParams) => {
    return pool.query(queryString, queryParams)
    .then(res => res.rows);
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