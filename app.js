const express = require("express")
const { User, Projects, Donations, Tags } = require("./models")
const app = express()

app.use(express.json())

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

app.post("/projects", async (req, res) => {
  const { userUuid, projectName, projectDescription } = req.body
  try {
    const user = await User.findOne({
      where: { uuid: userUuid },
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

module.exports = app
