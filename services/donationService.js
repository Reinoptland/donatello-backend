const { Donation } = require("../models")

const findDonationById = async (projectId) => {
  return await Donation.findAll({
    where: { projectId },
  })
}

module.exports = { findDonationById }
