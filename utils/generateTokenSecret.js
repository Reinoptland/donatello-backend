console.log(`Here is a secret: 

${require("crypto").randomBytes(64).toString("hex")}

Paste it in the .env under TOKEN_SECRET
`);
