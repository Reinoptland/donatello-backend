const { Router } = require("express")
const router = new Router()
const { authenticateToken } = require("../middlewares/auth")
const { userIdVerification } = require("../middlewares/userVerification")
const { findUserById } = require("../services/userService")
const { User, Project } = require("../models")

router.post("/user", async (req, res) => {
  try {
    await User.create({ ...req.body })
    return res.json("Account successfully created")
  } catch (err) {
    // console.log(err)
    return res.status(400).json(err.message)
  }
})

router.get(
  "/:userId",
  authenticateToken,
  userIdVerification,
  async (req, res) => {
    // make sure the user id from the token is the same as the userId from the route
    // const userId = await getVerifiedUserId(req, res)
    const { userId } = req.params
    try {
      const user = await findUserById(userId)
      // if (!user) res.status(400)
      return res.json(user)
    } catch (err) {
      return res.status(500).json(err)
    }
  }
)

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
        return res.status(400).json("Nothing to update.")
      }
      const user = await findUserById(userId)
      const updatedUser = await user.update({ ...reqUser })
      return res.json(updatedUser)
    } catch (err) {
      return res.status(400).json(err.message)
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
    } catch (err) {
      console.log(err)
      return res.status(500).json(err.message)
    }
  }
)

module.exports = router
