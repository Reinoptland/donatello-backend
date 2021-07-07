require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 4000,
  FRONTEND_BASEURL: process.env.FRONTEND_BASEURL || "http://localhost:3000",
};
