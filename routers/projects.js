const { Router } = require("express")
const router = new Router()
const { authenticateToken } = require("../middlewares/auth")
const { User, Projects, Donations } = require("../models")
const { getVerifiedUserId } = require("../utils/userVerification")
const { findUserById } = require("../services/userService")
const { findProjectById } = require("../services/userService")

router.get("/:userId", async (req, res) => {
  const { userId } = req.params
  // returns either an undefined or the actual token.
  try {
    const projects = await Projects.findAll({ where: { userId } })
    return res.json(projects)
  } catch (err) {
    return res.status(500).json(err)
  }
})

router.get("/:projectId", async (req, res) => {
  const projectId = req.params
  // returns either an undefined or the actual token.
  try {
    const project = await findProjectById(projectId)
    return res.json(project)
  } catch (err) {
    return res.status(500).json(err)
  }
})

router.post("/:userId", authenticateToken, async (req, res) => {
  const { projectName, projectDescription } = req.body
  const userId = await getVerifiedUserId(req)

  // returns either an undefined or the actual token.
  try {
    const user = await findUserById(userId)

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

// this should return a redirect url for the payment
router.post("/:projectId/donations/", async (req, res) => {
  const { projectId, donationAmount, comment } = req.body
  try {
    const project = await findProjectById(projectId)

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

router.patch("/:projectId", authenticateToken, async (req, res) => {
  console.log("request:", req)
  const { projectId } = req.params
  const reqProject = req.body
  try {
    const project = await Projects.findOne({
      where: { id: projectId },
    })
    // const project = await findProjectById(projectId)
    // console.log("Project?", project)
    const updatedProject = await project.update({ ...reqProject })
    return res.json(updatedProject)
  } catch (err) {
    return res.status(500).json(err)
  }
})

router.delete("/:projectId", authenticateToken, async (req, res) => {
  const projectId = req.params.projectId
  try {
    await Projects.destroy({ where: { id: projectId } })
    return res.status(204).json({ message: "Project deleted." })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Something went wrong" })
  }
})

module.exports = router
