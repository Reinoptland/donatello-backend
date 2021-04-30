require("dotenv").config()
const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next) => {
  console.log("WHAAAAT?")

  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401)
    req.user = user
    next()
  })
}

module.exports = { authenticateToken }
