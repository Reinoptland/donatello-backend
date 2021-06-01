const { Router } = require("express")
const router = new Router()
const { authenticateToken } = require("../middlewares/auth")
const { userIdVerification } = require("../middlewares/userVerification")
const { findUserById } = require("../services/userService")
const { User, Project } = require("../models")
const { generateToken } = require("../utils/generateToken")

router.post("/", async (req, res) => {
  try {
    const user = await User.create({ ...req.body })
    const token = generateToken({ userId: user.id })
    return res.json({
      token,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      iBan: user.bankAccount,
      message: "Account successfully created.",
    })
  } catch (error) {
    return res.status(400).json({ message: error.message, error })
  }
})

router.get(
  "/:userId",
  authenticateToken,
  userIdVerification,
  async (req, res) => {
    const { userId } = req.params
    try {
      const user = await findUserById(userId)
      return res.json(user)
    } catch (error) {
      return res.status(500).json({ message: error.message, error })
    }
  }
)

router.get("/:userId/projects", async (req, res) => {
  const { userId } = req.params
  try {
    const projects = await Project.findAll({ where: { userId } })
    if (projects.length === 0) {
      return res
        .status(404)
        .json({ message: "There are no projects associated with this user." })
    }
    const response = { projects }
    return res.json(response)
  } catch (error) {
    return res.status(500).json({ message: error.message, error })
  }
})

router.patch(
  "/:userId",
  authenticateToken,
  userIdVerification,
  async (req, res) => {
    // req.body includes user id + any data that needs to be updated
    // const userId = await getVerifiedUserId(req, res)
    const { userId } = req.params

    // console.log("reqUser:", reqUser)
    const reqUser = req.body
    try {
      if (Object.keys(reqUser).length === 0) {
        return res.status(400).json({ message: "Nothing to update." })
      }
      const user = await findUserById(userId)
      const updatedUser = await user.update({ ...reqUser })
      return res.json(updatedUser)
    } catch (error) {
      return res.status(400).json({ message: error.message, error })
    }
  }
)

router.delete(
  "/:userId",
  authenticateToken,
  userIdVerification,
  async (req, res) => {
    // const userId = await getVerifiedUserId(req, res)
    const { userId } = req.params

    try {
      await Project.destroy({ where: { userId: userId } })
      await User.destroy({ where: { id: userId } })
      return res.status(204).json({ message: "User & projects deleted" })
    } catch (error) {
      return res.status(500).json({ message: error.message, error })
    }
  }
)

module.exports = router
