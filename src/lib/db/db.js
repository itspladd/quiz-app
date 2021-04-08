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
  /*Constants needed by other DB functions.

  Avatar URL are generated on-the-fly by using an avatar ID.
  Since the URL and file extension data is needed by multiple DB helpers,
  we define them here.*/
  AVATAR_PATH: "/images/avatars/",
  AVATAR_FILETYPE: ".png",

  /**
   * Build the data needed to insert a new object into the database, then run query() to insert.
   * @param  {String} table
   *         The table to insert the data into.
   * @param  {Object} dataArray
   *         Array of objects to be added. All object keys must match columns in the target table.
   * @return {Object}
   *         A promise to the added data.
   *
   */
  query: function(queryString, queryParams) {
    // Optional logging, enable to check queries as they run
    /*console.log("Querying...");
    console.log(queryString);
    console.log(queryParams); */
    return pool.query(queryString, queryParams)
      .then(res => {
        // Optional logging, enable to check queries as they run
        /*console.log('returning: ', res.rows ) */
        return res.rows;
      })
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

    // This loop creates and appends to queryString: '($1, $2, ...$x), ($x+1, $x+2, $...x+x) ... ($nx+1, $nx+2, ...$nx+x)'
    // WHERE n = one less than the number of input *objects* in the data parameter
    // AND x = the number of keys per object.
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