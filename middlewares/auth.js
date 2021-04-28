require("dotenv").config()
const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next) => {
  // Returns the Bearer token. The format is "Bearer token", that's why we split in the token variable.
  const authHeader = req.headers["authorization"]
  // returns either an undefined or the actual token.
  const token = authHeader && authHeader.split(" ")[1]
  if (token == null) return res.sendStatus(401)

  // until now we've checked if we have a valid token. Below, we verify the token.
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    // The error is that the token is no longer valid.
    if (err) return res.sendStatus(401)
    req.user = user
    next()
  })
}

const generateToken = (userId) => {
  // Serialize the user data(name), access token & when the token expires
  return jwt.sign(userId, process.env.TOKEN_SECRET, { expiresIn: "90m" })
}

module.exports = { authenticateToken, generateToken }
