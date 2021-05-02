const express = require("express")
const app = express()
const projectRouter = require("./routers/projects")
const userRouter = require("./routers/users")
const { generateToken } = require("./utils/generateToken")
const { User } = require("./models")

// const users = require("./controllers/users")

app.use(express.json())

app.use("/projects", projectRouter)
app.use("/users", userRouter)

app.post("/login", async (req, res) => {
  const { email, password } = req.body
  // if (!email || !password) return res.sendStatus(401)

  try {
    const user = await User.findOne({
      where: { email, password },
    })
    if (!user)
      return res.status(404).json("An account with this email cannot be found")
    const userUuid = { userId: user.id }
    const token = generateToken(userUuid)
    return res.json({ token })
  } catch (err) {
    return res.status(500).json(err)
  }
})

// app.get("/posts", (req, res) => {})

module.exports = app
