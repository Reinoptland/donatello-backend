const { Router } = require("express")
const router = new Router()
const { authenticateToken } = require("../middlewares/auth")
const { Project, Donation, ProjectTag, Tag } = require("../models")
const {
  userIdVerification,
  userIdVerificationFromProject,
} = require("../middlewares/userVerification")
const { findUserById } = require("../services/userService")
const { findProjectById } = require("../services/projectService")
const { findDonationById } = require("../services/donationService")
const { createMollieClient } = require("@mollie/api-client")

const mollieClient = createMollieClient({
  apiKey: "test_3z3UFCnV8se28svBge5BEEmMxfGdVH",
})

router.get("/", async (req, res) => {
  const reqLimit = req.query.limit || 10
  const reqOffset = req.query.offset || 0
  const sortBy = req.query.sortBy || "recent"
  const tagNames = req.query.tagNames || []
  try {
    const sortedProjects = await Project.scope(sortBy, {
      method: ["byTags", tagNames],
    }).findAll({
      limit: reqLimit,
      offset: reqOffset,
      include: [{ model: Tag, as: "tags" }],
    })

    res.json({ sortedProjects })
  } catch (error) {
    return res.status(500).json({ message: error.message, error })
  }
})

router.get("/:userId", async (req, res) => {
  const { userId } = req.params
  try {
    const projects = await Project.findAll({ where: { userId } })
    if (projects.length === 0) {
      return res
        .status(500)
        .json({ message: "There are no projects associated with this user." })
    }
    return res.json(projects)
  } catch (error) {
    return res.status(500).json({ message: error.message, error })
  }
})

router.get("/:projectId/donations", async (req, res) => {
  const { projectId } = req.params
  try {
    const project = await Project.findAll({
      where: { id: projectId },
      include: { model: Donation, as: "donations" },
    })
    const response = { project }
    return res.json(response)
  } catch (error) {
    return res.status(500).json({ message: error.message, error })
  }
})

router.post("/:projectId/donations/", async (req, res) => {
  const { donationAmount, comment } = req.body
  const projectId = req.params.projectId
  const mollieObject = {
    amount: {
      value: donationAmount,
      currency: "EUR",
    },
    description: comment,
    redirectUrl: `https://www.google.com/`,
    webhookUrl: `https://a1ed8cc2844b.ngrok.io/webhooks/transactions`,
  }
  try {
    const payment = await mollieClient.payments.create(mollieObject)
    await Donation.create({
      projectId,
      donationAmount,
      comment,
      paymentId: payment.id,
    })

    return res.json({ payment })
  } catch (error) {
    return res.status(500).json({ message: error.message, error })
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
    } catch (error) {
      return res.status(500).json({ message: error.message, error })
    }
  }
)

router.post(
  "/:projectId/tags",
  authenticateToken,
  userIdVerificationFromProject,
  async (req, res) => {
    const { tagIds } = req.body
    try {
      const tagIdsInDb = await req.project.addTags(tagIds)
      return res.json(tagIdsInDb)
    } catch (error) {
      return res.status(500).json({ message: error.message, error })
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

    for (const projectKey of reqBodyKeys) {
      if (
        !(projectKey == "projectName" || projectKey == "projectDescription")
      ) {
        return res.status(403).json({
          message: `${projectKey} can't be updated. Only projectName and projectDescription can be updated.`,
        })
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
    } catch (error) {
      return res.status(500).json({ message: error.message, error })
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
    } catch (error) {
      return res.status(500).json({ message: error.message, error })
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
    } catch (error) {
      return res.status(500).json({ message: error.message, error })
    }
  }
)

module.exports = router
