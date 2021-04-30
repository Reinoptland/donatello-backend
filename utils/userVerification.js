require("dotenv").config()
const jwt = require("jsonwebtoken")

const userIdFromToken = (headers) => {
  const authHeader = headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
  return decoded.userId
}

const getVerifiedUserId = async (req) => {
  const userIdFromReq = req.params.userId
  const userId = await userIdFromToken(req.headers)
  if (userIdFromReq !== userId) return res.sendStatus(401)
  return userId
}

module.exports = { userIdFromToken, getVerifiedUserId }
