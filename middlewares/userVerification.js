require("dotenv").config()
const jwt = require("jsonwebtoken")
const { findProjectById } = require("../services/projectService")

const userIdFromToken = (headers) => {
  const authHeader = headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
  return decoded.userId
}

const userIdVerification = async (req, res, next) => {
  const userIdFromReq = req.params.userId
  const userId = await userIdFromToken(req.headers)
  if (userIdFromReq !== userId)
    return res.status(401).json({ message: "user Id does not match" })
  next()
}

const userIdVerificationFromProject = async (req, res, next) => {
  const { projectId } = req.params
  const project = await findProjectById(projectId)
  if (!project)
    return res
      .status(401)
      .json({ message: "No project can be found with this input." })
  const userIdFrProject = project.userId
  const userIdFrToken = await userIdFromToken(req.headers)
  if (userIdFrProject !== userIdFrToken)
    return res.status(401).json({ message: "user Id does not match" })
  req.project = project
  next()
}

module.exports = { userIdVerification, userIdVerificationFromProject }
