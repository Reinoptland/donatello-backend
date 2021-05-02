const { Router } = require("express")
const { Op } = require("sequelize")

const router = new Router()
const { authenticateToken } = require("../middlewares/auth")
const { Projects, Donations, Tags, ProjectsTags } = require("../models")
const { userIdVerification } = require("../middlewares/userVerification")
const { findUserById } = require("../services/userService")
const { findProjectById } = require("../services/projectService")
const { findDonationById } = require("../services/donationService")

// - Get the 10 most recent projects (x number per page)
// - Get the 10 most funded projects based on amount
// - Get the 10 most popular projects based on number of transactions

router.get("/", async (req, res) => {
  try {
    // extract all queries from req
    // fetch all projects
    // if req.query has byDate -> sort by most recent projects
    // const sortedByDate = await Projects.findAll({
    //   limit: 10,
    //   order: [["updatedAt", "DESC"]],
    // })

    // console.log(sortedByDate)
    // if req.query has byFunding -> sort by projects with highest total amount of funding
    const groupedDonations = await Projects.findAll({
      include: { model: Donations, as: "donations" },
      // where: { donationAmount: { [Op.gt]: 300 } },
      // group: [["projects.id", "projectId"]], // note for Rein - why "id" is required? is that an SQL-native thing?
      // order: [["donationAmount", "DESC"]],
      // order: [["projectId", "DESC"]],
    })

    console.log("groupedDonations:", groupedDonations.length)
    const whatSum = await Donations.sum("donationAmount")
    console.log("SUM:", whatSum)
    // const sortedByDonation = await Projects.findAll({
    //   limit: 10,
    //   order: [[Projects.associations.Donations, "donationAmount", "DESC"]],
    // })
    // console.log("sortedByDonation:", sortedByDonation)
    return res.json({ groupedDonations })
    // if req.query has byPopularity -> sort by highest number of transactions
  } catch (error) {
    console.log("ERROR:", error)
    return res.status(500).json(error)
  }
})

router.get("/:userId", async (req, res) => {
  const { userId } = req.params
  try {
    const projects = await Projects.findAll({ where: { userId } })
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
    // console.log("projectName: ", projectName)
    const tagIds = req.body.tagIds
    // const userId = await getVerifiedUserId(req, res)
    const { userId } = req.params

    // returns either an undefined or the actual token.
    try {
      const user = await findUserById(userId)

      const project = await Projects.create({
        projectName,
        projectDescription,
        userId: user.id,
      })

      // const projectId = project.id
      // console.log("projectId:", projectId)
      // console.log("tagIds:", tagIds)
      // const promisedTags = []
      // for (const tagId of tagIds) {
      //   promisedTags.push(Tags.findOne({ where: { id: tagId } }))
      // }
      // const resolvedTags = await Promise.all(promisedTags)

      // await project.addRepository(resolvedTags[0])

      // const projectWithAssociation = await Projects.findOne({
      //   where: { id: project.id },
      //   include: [Tags],
      // })

      // console.log("projectWithAssociation?", projectWithAssociation)
      // console.log("tagsProjectsAdded?", tagsProjectsAdded)
      // const tagIdFromDb = resolvedTags[0].id
      // const createProjectTags = await ProjectsTags.create({
      //   tagId: tagIdFromDb,
      //   projectId,
      // })

      // console.log("createProjectTags", createProjectTags)
      // const projectsTagsArray = []
      // for (const tagId of tagIds) {
      //   projectsTagsArray.push(ProjectsTags.create({ tagId, projectId }))
      // }
      // const projectsTags = await Promise.all(projectsTagsArray)
      // const createProjectTags = async (tagId) => {
      //   console.log("{ tagId, projectId }", { tagId, projectId })
      //   return await ProjectsTags.create({ tagId, projectId })
      // }

      // const projectTags = async () => {
      //   return Promise.all(
      //     tagIds.map((tagId) => {
      //       console.log("tagID:", tagId)
      //       createProjectTags(tagId)
      //     })
      //   )
      // }
      // console.log("what is promise.all:", projectsTags)
      // const projectsTags = tagIds.map(async (tagId) => {
      //   await ProjectsTags.create({ tagId, projectId })
      // })
      // console.log("projectTags:", projectTags)
      // projectTags()

      return res.json(project)
    } catch (err) {
      return res.status(500).json(err)
    }
  }
)

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
    return res.status(500).json({ error: "Something went wrong" })
  }
})

module.exports = router
