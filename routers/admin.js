const { Router } = require("express")
const router = new Router()
const db = require("../models")

router.get("/metrics", async (req, res) => {
  const [results, metaData] = await db.sequelize.query(`
        --Average Donation Amount
        SELECT avg("donationAmount") 
        FROM donations 
        WHERE "paymentStatus" = 'paid';
      
        -- Percentage split by payment status
        SELECT count("id"), "paymentStatus", count(*) * 100.0 / (SELECT count("projectId") FROM donations) AS Percentage
        FROM donations 
        GROUP BY "paymentStatus";
      
        -- Count of donations for the last 30 days
        SELECT count("id")
        FROM donations 
        WHERE "paymentStatus" = 'paid' AND "createdAt" BETWEEN NOW() - INTERVAL '30 DAYS' AND NOW()
          `)
  res.render("metrics", { metrics: results })
  console.log(results)
})

module.exports = router
