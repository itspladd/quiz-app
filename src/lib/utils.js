/**
 * Returns a random alphanumeric string.
 * @param  {number} length
 *         The desired length of the generated string.
 * @return {string}
 *         A string of random alphanumeric characters.
 */
 const generateRandomString = (length) => {
  const alpha = "abcdefghijklmnopqrstuvwxyz";
  const num = "1234567890";
  const alphaNum = alpha + alpha.toUpperCase() + num;
  let randomStr = "";
  for (let index = 0; index < length; index++) {
    randomStr += alphaNum[Math.floor(Math.random() * alphaNum.length)];
  }
  return randomStr;
};

module.exports = {
  generateRandomString
};