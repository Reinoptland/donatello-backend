const app = require("./app");
const { sequelize } = require("./models");
const { PORT } = require("./config/network");

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  await sequelize.authenticate();
  console.log("Database connected!");
});
