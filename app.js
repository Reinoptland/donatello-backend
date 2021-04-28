const express = require("express")
const { User, Projects, Donations, Tags } = require("./models")
const app = express()
const { generateToken, authenticateToken } = require("./middlewares/auth")

app.use(express.json())

// app.get("/posts", (req, res) => {})

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

app.post("/project", authenticateToken, async (req, res) => {
  const { userId, projectName, projectDescription } = req.body
  // returns either an undefined or the actual token.
  try {
    const user = await User.findOne({
      where: { id: userId },
    })
    const project = await Projects.create({
      projectName,
      projectDescription,
      userId: user.id,
    })
    return res.json(project)
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

app.get("/my-account/:userId", authenticateToken, async (req, res) => {
  // req.body includes user id + any data that needs to be updated
  const { userId } = req.params
  try {
    let user = await User.findOne({
      where: { id: userId },
    })
    return res.json(user)
  } catch (err) {
    return res.status(500).json(err)
  }
})

app.patch("/my-account/:userId", authenticateToken, async (req, res) => {
  // req.body includes user id + any data that needs to be updated
  const { userId } = req.params
  const reqUser = req.body
  try {
    let user = await User.findOne({
      where: { id: userId },
    })
    const updatedUser = await user.update({ ...reqUser })
    return res.json(updatedUser)
  } catch (err) {
    return res.status(500).json(err)
  }
})

app.patch("/project/:projectId", authenticateToken, async (req, res) => {
  const { projectId } = req.params
  const reqProject = req.body
  try {
    let project = await Projects.findOne({
      where: { id: projectId },
    })

    const updatedProject = await project.update({ ...reqProject })
    return res.json(updatedProject)
  } catch (err) {
    return res.status(500).json(err)
  }
})

app.delete("/delete-user/:id", async (req, res) => {
  const id = req.params.id
  try {
    await Projects.destroy({ where: { userId: id } })
    await User.destroy({ where: { id } })
    return res.status(204).json({ message: "User & projects deleted" })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Something went wrong" })
  }
})

app.delete("/delete-project/:id", async (req, res) => {
  const projectId = req.params.id
  try {
    await Projects.destroy({ where: { id: projectId } })
    return res.status(204).json({ message: "Project deleted." })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Something went wrong" })
  }
})

module.exports = app
