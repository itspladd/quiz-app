require("dotenv").config();

let dbParams = {};
if (process.env.DATABASE_URL) {
  dbParams.connectionString = process.env.DATABASE_URL;
  dbParams.ssl = { rejectUnauthorized: false };
} else {
  dbParams = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  };
}

const {
  Pool
} = require("pg");
const pool = new Pool(dbParams);

module.exports = {
  // Avatar URLs are generated on-the-fly using the avatar ID.
  // Since the URL and file extension data is needed by multiple DB helpers,
  // we define them here.
  AVATAR_PATH: "/images/avatars/",
  AVATAR_FILETYPE: ".png",

  /**
   * Single point-of-entry for all database queries.
   * Queries the database with the input string and parameters.
   * @param  {String} queryString
   *         The query in string format, with $1-style variables.
   * @param  {Array} queryParams
   *         The parameters to be inserted at the $1 variables in the query.
   * @return {Object}
   *         A promise to the rows of data retrieved.
   *
   */
  query: function(queryString, queryParams) {
    return pool.query(queryString, queryParams)
      .then(res => res.rows)
      .catch(err => console.error(err));
  },

  /**
   * Build the data needed to insert a new object into the database, then run query() to insert.
   * Works for single objects and arrays of objects with identical keys, all of which must match columns in the target table.
   * @param  {String} table
   *         The table to insert the data into.
   * @param  {Array, object} data
   *         Array of objects to be added. All object keys must match columns in the target table.
   * @return {Object}
   *         A promise to the added data.
   *
   */
  insert: function(table, data) {
    // If it's a single object rather than an array, turn it into an array.
    if (!Array.isArray(data)) {
      data = [data];
    }
    // Initialize the array that will hold the values and table name.
    // Give it the table name and the columns.
    const columnsString = Object.keys(data[0]).join(", ");

    let queryString = `
      INSERT INTO ${table} (${columnsString})
      VALUES
      `;
    // Now we build the variable string for the values, while adding each value to queryParams.
    // PSQL variables start at $1, so we init varNumber to 1.
    let varNumber = 1;
    const queryParams = [];

    // This loop creates and appends the following string to queryString:
    //  '($1, $2, ...$x), ($x+1, $x+2, $...x+x) ... ($nx+1, $nx+2, ...$nx+x)'
    //    WHERE n = one less than the number of input *objects* in the data parameter
    //    AND x = the number of keys per object.
    // So four objects with two keys each would give '($1, $2), ($3, $4), ($5, $6), ($7, $8)' 
    for (let row of data) {
      queryString += (varNumber === 1) ? "(" : ", (";
      const values = Object.values(row);
      const varsArr = [];
      for (let value of values) {
        queryParams.push(value);
        varsArr.push(`$${varNumber}`);
        varNumber++;
      }
      queryString += varsArr.join(", ");
      queryString += ")";
    }

    // Finally, tell the query to return everything inserted, and call db.query.
    queryString += " RETURNING *;";
    return this.query(queryString, queryParams)
      .catch(err => console.error(err));
  }

};