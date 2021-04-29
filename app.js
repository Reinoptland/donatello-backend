const express = require("express")
const { User, Projects, Donations, Tags } = require("./models")
const app = express()
const { generateToken, authenticateToken } = require("./middlewares/auth")
const projectRouter = require("./routers/projects")

app.use(express.json())
app.use(projectRouter)

// app.get("/posts", (req, res) => {})

app.post("/users", async (req, res) => {
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

app.get("/users/:userId", authenticateToken, async (req, res) => {
  // make sure the user id from the token is the same as the userId from the route
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

app.patch("/users/:userId", authenticateToken, async (req, res) => {
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

app.delete("/users/:id", async (req, res) => {
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

module.exports = app
