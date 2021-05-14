const { Router } = require("express")
const router = new Router()
const { generateToken } = require("../utils/generateToken")
const { User } = require("../models")

router.post("/", async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({
      where: { email, password },
    })
    if (!user)
      return res.status(404).json("An account with this email cannot be found")
    const userUuid = { userId: user.id }
    const token = generateToken(userUuid)
    return res.json({ token })
  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = router
