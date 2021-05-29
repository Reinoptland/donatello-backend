const { Router } = require("express")
const router = new Router()
const { Donation } = require("../models")
const { findProjectById } = require("../services/projectService")
const { mollieClient } = require("../services/paymentService")

router.post("/transactions", async (req, res) => {
  const id = req.body.id

  try {
    const payment = await mollieClient.payments.get(id)
    const donation = await Donation.findOne({
      where: { paymentId: id },
    })
    const updatedDonation = await donation.update({
      paymentStatus: payment.status,
    })

    if (updatedDonation.paymentStatus === "paid") {
      const projectToUpdate = await findProjectById(donation.projectId)
      const updatedDonationAmount =
        projectToUpdate.totalDonationAmount + Number(donation.donationAmount)
      const updatedDonationCount = projectToUpdate.totalDonationCount + 1
      await projectToUpdate.update({
        totalDonationAmount: updatedDonationAmount,
        totalDonationCount: updatedDonationCount,
      })
    }
    return res.status(200).json("OK")
  } catch (err) {
    console.log(error)
    return res.status(500).json({ message: error.message, error })
  }
})

module.exports = router
