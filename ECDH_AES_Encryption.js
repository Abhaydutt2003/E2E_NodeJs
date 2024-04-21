const crypto = require("crypto");

function generateIV() {
  return crypto.randomBytes(16);
}

//encrypt decrypt functions

//function to encrpyt a message using AES-256-CBC(AES-256-CTR does not require an IV)
function encrpytMessage(message, sharedSecret) {
  const iv = generateIV();
  const cipher = crypto.createCipheriv("aes-256-cbc", sharedSecret, iv);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

//function to encrpyt a message using AES-256-CBC
function decryptMessage(encryptedData, sharedSecret) {
  const [iv, encryptedText] = encryptedData.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    sharedSecret,
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

//ECDH implementation

const alice = crypto.createECDH("secp256k1");
let alicePublicKey = alice.generateKeys();

const bob = crypto.createECDH("secp256k1");
let bobPublicKey = bob.generateKeys();

const aliceSecretKey = alice.computeSecret(bobPublicKey);
const bobSecretKey = bob.computeSecret(alicePublicKey);

const message = "Never Gonna";

const encryptedMessage = encrpytMessage(message, aliceSecretKey);
console.log("encryptedMessage:", encryptedMessage);

const decryptedMessage = decryptMessage(encryptedMessage, bobSecretKey);
console.log("DecryptedMessage:", decryptedMessage);
