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

const { Pool } = require("pg");
const pool = new Pool(dbParams);

module.exports = {
  query: function(queryString, queryParams) {
    // Optional logging, enable to check queries as they run
    /*console.log("Querying...");
    console.log(queryString);
    console.log(queryParams); */
    return pool.query(queryString, queryParams)
      .then(res => {
      // Optional logging, enable to check queries as they run
      /* console.log('returning: ', res.rows ) */
        return res.rows;
      })
      .catch(err => console.error(err));
  },

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
  insert: function(table, data) {
    // If it's a single object rather than an array, turn it into an array.
    if(!Array.isArray(data)) {
      data = [data];
    }
    // Initialize the array that will hold the values and table name.
    // Give it the table name and the columns.
    const columnsString = Object.keys(data[0]).join(", ");

    let queryString = `INSERT INTO ${table} (${columnsString}) VALUES `;
    // Now we build the variable string for the values, while adding them to queryParams.
    let varNumber = 1;
    const startVar = varNumber;
    const queryParams = [];
    for (let row of data) {
      queryString += (varNumber === startVar) ? "(" : ", (";
      const values = Object.values(row);
      const varsArr = []
      for (let value of values) {
        queryParams.push(value);
        varsArr.push(`$${varNumber}`);
        varNumber++;
      }
      queryString += varsArr.join(", ");
      queryString += ")"
    }
    queryString += " RETURNING *;"
    return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => console.error(err));
  }
};