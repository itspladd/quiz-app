const db = require("../db");

module.exports = {

  /**
   * Get quizzes using optional query parameters.
   * Used to build a list of quizzes with relevant details.
   * @param {{}} options An object containing query options.
   * @param {*} limit The number of results to return.
   * @return {Promise<[{}]>}  A promise to the quiz array.
   */
  getQuizzes: function(options, limit = 10) {
    let queryString = "SELECT ";
  }
};