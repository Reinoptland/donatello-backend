const { Router } = require("express")

const router = new Router()
const { authenticateToken } = require("../middlewares/auth")
const { Project, Donation, Tag, ProjectTag } = require("../models")
const {
  userIdVerification,
  userIdVerificationFromProject,
} = require("../middlewares/userVerification")
const { findUserById } = require("../services/userService")
const { findProjectById } = require("../services/projectService")
const { findDonationById } = require("../services/donationService")

// - Get the 10 most recent projects (x number per page)
// - Get the 10 most funded projects based on amount
// - Get the 10 most popular projects based on number of transactions

router.get("/", async (req, res) => {
  const reqLimit = req.query.limit || 10
  const reqOffset = req.query.offset || 0
  const sortBy = req.query.sortBy || "recent"

  try {
    const sortedProjects = await Project.scope(sortBy).findAll({
      limit: reqLimit,
      offset: reqOffset,
    })

    // const sortedByDate = await Project.findAll({
    //   limit: reqLimit || 10,
    //   offset: offset || 0,
    //   order: [["updatedAt", "DESC"]],
    // })
    // const sortedByDonationAmount = await Projects.findAll({
    //   include: {
    //     model: Donations,
    //     as: "donations",
    //   },
    // })

    // const sortingFunc = sortOptions[date] || sortOptions[donationAmount]
    res.json({ sortedProjects })
  } catch (error) {
    console.log("ERROR:", error)
    return res.status(500).json(error)
  }
})

router.get("/:userId", async (req, res) => {
  const { userId } = req.params
  try {
    const projects = await Project.findAll({ where: { userId } })
    return res.json(projects)
  } catch (err) {
    return res.status(500).json(err)
  }
})

router.get("/:projectId/donations", async (req, res) => {
  const { projectId } = req.params
  try {
    const project = await findProjectById(projectId)
    const donations = await findDonationById(projectId)
    const response = { project, donations }
    return res.json(response)
  } catch (err) {
    return res.status(500).json(err)
  }
})

router.post(
  "/:userId",
  authenticateToken,
  userIdVerification,
  async (req, res) => {
    const { projectName, projectDescription } = req.body.project
    const { tagIds } = req.body
    const { userId } = req.params

    try {
      const user = await findUserById(userId)
      const project = await Project.create(
        {
          projectName,
          projectDescription,
          userId: user.id,
          ProjectTags: tagIds.map((tagId) => ({ tagId: tagId })),
        },
        { include: [ProjectTag] }
      )
      // const projectTagData = await project.addTags(tagIds)
      return res.json({ ...project.dataValues })
    } catch (err) {
      console.log(err)
      return res.status(500).json(err.message)
    }
  }
)

// this should return a redirect url for the payment
router.post("/:projectId/donations/", async (req, res) => {
  const { donationAmount, comment } = req.body
  try {
    const donation = await Donation.create({
      projectId: req.project.id,
      donationAmount,
      comment,
    })
    return res.json(donation)
  } catch (error) {
    return res.status(500).json(error)
  }
})

router.post(
  "/:projectId/tags",
  authenticateToken,
  userIdVerificationFromProject,
  async (req, res) => {
    const { tagIds } = req.body
    try {
      const tagIdsInDb = await req.project.addTags(tagIds)
      return res.json(tagIdsInDb)
    } catch (err) {
      return res.status(500).json(err)
    }
  }
)

router.patch(
  "/:projectId",
  authenticateToken,
  userIdVerificationFromProject,
  async (req, res) => {
    // const {projectNewData} = req.body
    const requestBody = req.body
    const reqBodyKeys = Object.keys(requestBody)
    console.log("reqBodyKeys", reqBodyKeys)

    for (const projectKey of reqBodyKeys) {
      if (
        !(projectKey == "projectName" || projectKey == "projectDescription")
      ) {
        return res
          .status(403)
          .json(
            `${projectKey} can't be updated. Only projectName and projectDescription can be updated.`
          )
      }
    }

    const { projectName, projectDescription } = requestBody
    const projectToUpdate = req.project
    try {
      const updatedProject = await projectToUpdate.update({
        projectName,
        projectDescription,
      })
      return res.json(updatedProject)
    } catch (err) {
      return res.status(500).json(err)
    }
  }
)

router.delete(
  "/:projectId/tags/:tagId",
  authenticateToken,
  userIdVerificationFromProject,
  async (req, res) => {
    const { tagId, projectId } = req.params
    try {
      await ProjectTag.destroy({ where: { tagId, projectId } })
      return res.status(204).json({ message: "Tag deleted." })
    } catch (err) {
      return res.status(500).json({ error: "Something went wrong" })
    }
  }
)

router.delete(
  "/:projectId",
  authenticateToken,
  userIdVerificationFromProject,
  async (req, res) => {
    const { projectId } = req.params
    try {
      await Project.destroy({ where: { id: projectId } })
      return res.status(204).json({ message: "Project deleted." })
    } catch (err) {
      return res.status(500).json({ error: "Something went wrong" })
    }
  }
)

module.exports = router
