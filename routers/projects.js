const { Router } = require("express")
const router = new Router()
const { authenticateToken } = require("../middlewares/auth")
const { User, Projects } = require("../models")

router.post("/projects", authenticateToken, async (req, res) => {
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

router.post("/projects/:id/donations/", async (req, res) => {
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

router.patch("/projects/:projectId", authenticateToken, async (req, res) => {
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

router.delete("/projects/:id", async (req, res) => {
  const projectId = req.params.id
  try {
    await Projects.destroy({ where: { id: projectId } })
    return res.status(204).json({ message: "Project deleted." })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Something went wrong" })
  }
})

module.exports = router
