const { User } = require("../models")

const findUserById = async (userId) => {
  return await User.findOne({
    where: { id: userId },
  })
}

module.exports = { findUserById }
