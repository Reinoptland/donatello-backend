const { Router } = require("express")
const router = new Router()
const { authenticateToken } = require("../middlewares/auth")
const { getVerifiedUserId } = require("../utils/userVerification")
const { findUserById } = require("../services/userService")
const { User, Projects } = require("../models")

router.post("/", async (req, res) => {
  try {
    const user = await User.create({ ...req.body })
    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(400).json(err.message)
  }
})

router.get("/:userId", authenticateToken, async (req, res) => {
  // make sure the user id from the token is the same as the userId from the route
  const userId = await getVerifiedUserId(req)
  try {
    const user = await findUserById(userId)
    return res.json(user)
  } catch (err) {
    return res.status(500).json(err)
  }
})

router.patch("/:userId", authenticateToken, async (req, res) => {
  // req.body includes user id + any data that needs to be updated
  const userId = await getVerifiedUserId(req)

  const reqUser = req.body
  try {
    const user = await findUserById(userId)
    const updatedUser = await user.update({ ...reqUser })
    return res.json(updatedUser)
  } catch (err) {
    return res.status(500).json(err)
  }
})

router.delete("/:userId", authenticateToken, async (req, res) => {
  const userId = await getVerifiedUserId(req)

  try {
    await Projects.destroy({ where: { userId: userId } })
    await User.destroy({ where: { id: userId } })
    return res.status(204).json({ message: "User & projects deleted" })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Something went wrong" })
  }
})

module.exports = router
