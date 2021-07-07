const { createMollieClient } = require("@mollie/api-client");
const {
  molliePayments: { MOLLIE_API_KEY },
} = require("../config/services");

const mollieClient = createMollieClient({
  apiKey: MOLLIE_API_KEY,
});

module.exports = { mollieClient };
