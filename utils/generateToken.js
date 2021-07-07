const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../config/secrets");

const generateToken = (userId) => {
  // Serialize the user data(name), access token & when the token expires
  return jwt.sign(userId, TOKEN_SECRET, { expiresIn: "90m" });
};

module.exports = { generateToken };
