const db = require("./models")
const makeProductOwnerHappy = async () => {
  const [results, metaData] = await db.sequelize.query(`
  SELECT avg("donationAmount") 
  FROM donations 
  WHERE "paymentStatus" = 'paid';
  
  SELECT count("id"), "paymentStatus", count(*) * 100.0 / (SELECT count("projectId") FROM donations) AS Percentage
  FROM donations 
  GROUP BY "paymentStatus"
    `)
  console.log(results)
}

makeProductOwnerHappy()
