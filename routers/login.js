const { Router } = require("express")
const router = new Router()
const { generateToken } = require("../utils/generateToken")
const { User } = require("../models")

router.post("/", async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({
      where: { email },
      // where: { email, password },
    })
    const passwordMatch = await user.comparePassword(password)
    if (!passwordMatch)
      return res
        .status(404)
        .json({ message: "The email & password do not match" })
    const userUuid = { userId: user.id }
    const token = generateToken(userUuid)
    return res.json({ token })
  } catch (error) {
    return res.status(500).json({ message: error.message, error })
  }
})

module.exports = router
