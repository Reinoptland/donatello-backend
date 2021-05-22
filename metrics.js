const db = require("./models")
const makeProductOwnerHappy = async () => {
  const [results, metaData] = await db.sequelize.query(`
  --Average Donation Amount
  SELECT avg("donationAmount") 
  FROM donations 
  WHERE "paymentStatus" = 'paid';

  -- Percentage split by payment status
  SELECT count("id"), "paymentStatus", count(*) * 100.0 / (SELECT count("projectId") FROM donations) AS Percentage
  FROM donations 
  GROUP BY "paymentStatus";

  -- Count of donations for the month of May
  SELECT count("id")
  FROM donations 
  WHERE "paymentStatus" = 'paid' AND "createdAt" BETWEEN '2021-05-01T00:00:00.000' AND '2021-05-30T00:00:00.000'
    `)
  console.log(results)
}

makeProductOwnerHappy()
