const express = require("express")
const { User, Projects, Donations, Tags } = require("./models")
const app = express()
const jwt = require("jsonwebtoken")

app.use(express.json())

// app.get("/posts", (req, res) => {})

const generateToken = (userId) => {
  // Serialize the user data(name), access token & when the token expires
  return jwt.sign(userId, process.env.TOKEN_SECRET, { expiresIn: "90m" })
}

app.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName, bankAccount } = req.body
  try {
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      bankAccount,
    })
    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(400).json(err.message)
  }
})

const authenticateToken = (req, res, next) => {
  // Returns the Bearer token. The format is "Bearer token", that's why we split in the token variable.
  const authHeader = req.headers["authorization"]
  // returns either an undefined or the actual token.
  const token = authHeader && authHeader.split(" ")[1]
  if (token == null) return res.sendStatus(401)

  // until now we've checked if we have a valid token. Below, we verify the token.
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    // The error is that the token is no longer valid.
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.post("/new-project", authenticateToken, async (req, res) => {
  const { userId, projectName, projectDescription } = req.body
  // returns either an undefined or the actual token.
  try {
    const user = await User.findOne({
      where: { id: userId },
    })
    const post = await Projects.create({
      projectName,
      projectDescription,
      userId: user.id,
    })
    return res.json(post)
  } catch (err) {
    return res.status(500).json(err)
  }
})

app.post("/make-a-donation/", async (req, res) => {
  const { projectId, donationAmount, comment } = req.body
  try {
    const project = await Projects.findOne({
      where: { id: projectId },
    })
    // console.log("found the project???", project)
    const donation = await Donations.create({
      projectId: project.id,
      donationAmount,
      comment,
    })
    return res.json(donation)
  } catch (error) {
    return res.status(500).json(error)
  }
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.sendStatus(401)

  try {
    const user = await User.findOne({
      where: { email, password },
    })
    if (user === null) return res.sendStatus(404)
    const userUuid = { userId: user.id }
    const token = generateToken(userUuid)
    return res.json({ token })
  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = app
