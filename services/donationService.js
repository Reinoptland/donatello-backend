const { Donations } = require("../models")

const findDonationById = async (projectId) => {
  return await Donations.findAll({
    where: { projectId },
  })
}

module.exports = { findDonationById }
