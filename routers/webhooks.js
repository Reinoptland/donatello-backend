const { Router } = require("express")
const router = new Router()
const { Donation } = require("../models")
const { findProjectById } = require("../services/projectService")
const { createMollieClient } = require("@mollie/api-client")

const mollieClient = createMollieClient({
  apiKey: "test_3z3UFCnV8se28svBge5BEEmMxfGdVH",
})

router.post("webhooks/transactions", async (req, res) => {
  const id = req.body.id
  const projectId = req.params.projectId

  try {
    const payment = await mollieClient.payments.get(id)
    const donation = await Donation.findOne({
      where: { paymentId: id },
    })
    const updatedDonation = await donation.update({
      paymentStatus: payment.status,
    })

    if (updatedDonation.paymentStatus === "paid") {
      const projectToUpdate = await findProjectById(projectId)
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
    return res.status(500).json(err)
  }
})

module.exports = router
