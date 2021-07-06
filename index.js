const app = require("./app");
const { sequelize } = require("./models");
const ngrok = require("ngrok");

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  await sequelize.authenticate();
  console.log("Database connected!");
  const ngrokUrl = await ngrok.connect(PORT);
  process.env.NGROK_URL = ngrokUrl;
});
