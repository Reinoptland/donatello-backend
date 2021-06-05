const AWS = require("aws-sdk")
const region = "eu-west-1"
const secretName = "donatello-secrets"

// Create a Secrets Manager client
const client = new AWS.SecretsManager({
  region: region,
})

const awsDecodedSecret = async () => {
  const secretData = await client
    .getSecretValue({ SecretId: secretName })
    .promise()
  if (!secretData) {
    throw new Error(`No or invalid secret found`)
  }

  if ("SecretString" in secretData) {
    const secret = secretData.SecretString
    return secret
  } else {
    let buff = new Buffer(secretData.SecretBinary, "base64")
    const decodedBinarySecret = buff.toString("ascii")
    return decodedBinarySecret
  }
}

module.exports = { awsDecodedSecret }
