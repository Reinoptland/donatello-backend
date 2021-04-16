const app = require("./app")
const { sequelize } = require("./models")

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`)
  //   await sequelize.sync({ force: true })
  await sequelize.authenticate()
  console.log("Database connected!")
})
