const express = require("express")
const app = express()
const cors = require("cors")
const projectRouter = require("./routers/projects")
const userRouter = require("./routers/users")
const webhookRouter = require("./routers/webhooks")
const loginRouter = require("./routers/login")
const adminRouter = require("./routers/admin")

app.set("view engine", "ejs")
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(cors())

app.use("/projects", projectRouter)
app.use("/users", userRouter)
app.use("/webhooks", webhookRouter)
app.use("/login", loginRouter)
app.use("/admin", adminRouter)

module.exports = app
