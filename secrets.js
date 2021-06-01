const AWS = require("aws-sdk")
const region = "eu-west-1"
const secretName = "donatello-secrets"
let secret
let decodedBinarySecret

// Create a Secrets Manager client
const client = new AWS.SecretsManager({
  region: region,
})

// In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
// We rethrow the exception by default.

const awsDecodedSecret = async () => {
  const secretData = await client
    .getSecretValue({ SecretId: secretName })
    .promise()

  if (!secretData) {
    throw new Error(`No or invalid secret found`)
  }

  if ("SecretString" in secretData) {
    secret = secretData.SecretString
    console.log("secret:", secret)
    return secret
  } else {
    let buff = new Buffer(secretData.SecretBinary, "base64")
    decodedBinarySecret = buff.toString("ascii")
    // console.log("decodedBinarySecret:", decodedBinarySecret)
  }
}

const { DEV_DATABASE_URL, TEST_DATABASE_URL, TOKEN_SECRET, MOLLIE_API_KEY } =
  awsDecodedSecret()

module.exports = {
  DEV_DATABASE_URL,
  TEST_DATABASE_URL,
  TOKEN_SECRET,
  MOLLIE_API_KEY,
}
