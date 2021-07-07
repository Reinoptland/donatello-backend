require("dotenv").config();
const ngrok = require("ngrok");
const { PORT } = require("./network");
const env = process.env.NODE_ENV || "development";

const config = {
  development: {
    molliePayments: {
      MOLLIE_API_KEY: process.env.MOLLIE_TEST_API_KEY,
      WEBHOOK_BASEURL: null, // ngrok will populate this url on startup
    },
  },
  test: {
    molliePayments: {
      MOLLIE_API_KEY: process.env.MOLLIE_TEST_API_KEY,
      WEBHOOK_BASEURL: "https://www.testwebhookurlformollie.com",
    },
  },
  production: {
    molliePayments: {
      MOLLIE_API_KEY: process.env.MOLLIE_API_KEY,
      WEBHOOK_BASEURL: process.env.PRODUCTION_BASEURL,
    },
  },
};

// start ngrok and expose our port to the internet to be able to test mollie payments webhooks
// this is not needed during automated testing,
// in production our server is already accessible through the internet
if (env === "development") {
  ngrok
    .connect(PORT)
    .then((ngrokUrl) => {
      config["development"].molliePayments.WEBHOOK_BASEURL = ngrokUrl;
    })
    .catch((error) => {
      console.log("NGROK not initialized for testing, exiting");
      console.error(error);
    });
}

module.exports = config[env];
