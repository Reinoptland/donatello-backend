const express = require("express")
const app = express()
const projectRouter = require("./routers/projects")
const userRouter = require("./routers/users")
const webhookRouter = require("./routers/webhooks")
const loginRouter = require("./routers/login")

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use("/projects", projectRouter)
app.use("/users", userRouter)
app.use("/webhooks", webhookRouter)
app.use("/login", loginRouter)

module.exports = app
