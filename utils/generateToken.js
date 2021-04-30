require("dotenv").config()
const jwt = require("jsonwebtoken")

const generateToken = (userId) => {
  // Serialize the user data(name), access token & when the token expires
  return jwt.sign(userId, process.env.TOKEN_SECRET, { expiresIn: "90m" })
}

module.exports = { generateToken }
