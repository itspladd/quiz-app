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

/**
 * Returns a string describing the relative time since the given timestamp (milliseconds)
 * @param  {number} timestamp
 *         The UNIX timestamp (in milliseconds) to convert
 * @return {string}
 *         A string describing the elapsed time
 */
const convertTimestamp = (timestamp, timestamp2) => {
  // Retrieve current date in milliseconds and calculate difference
  let appendAgo = "";
  let minimumResponse = "< 2 seconds";
  if (!timestamp2) {
    const currentDate = timestamp2 || new Date();
    timestamp2 = Math.floor(currentDate.getTime());
    appendAgo = " ago";
    minimumResponse = "Just now";
  }
  const seconds = Math.floor((timestamp2 - timestamp) / 1000);
  // Return a message based on difference
  if (seconds > 365 * 24 * 3600) {
    const years = Math.floor(seconds / (365 * 24 * 3600));
    return `${years} year${years === 1 ? "" : "s"}${appendAgo}`;
  } else if (seconds > 30 * 24 * 3600) {
    const months = Math.floor(seconds / (30 * 24 * 3600));
    return `${months} month${months === 1 ? "" : "s"}${appendAgo}`;
  } else if (seconds > 24 * 3600) {
    const days = Math.floor(seconds / (24 * 3600));
    return `${days} day${days === 1 ? "" : "s"}${appendAgo}`;
  } else if (seconds > 3600) {
    const hours = Math.floor(seconds / (3600));
    return `${hours} hour${hours === 1 ? "" : "s"}${appendAgo}`;
  } else if (seconds > 60) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes === 1 ? "" : "s"}${appendAgo}`;
  } else if (seconds > 2) {
    return `${seconds} seconds`;
  } else {
    return minimumResponse;
  }
};

module.exports = {
  generateRandomString,
  convertTimestamp
};