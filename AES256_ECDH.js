const crypto = require("crypto");

const alice = crypto.createECDH("secp256k1");
let alicePublicKey = alice.generateKeys();

const bob = crypto.createECDH("secp256k1");
let bobPublicKey = bob.generateKeys();

const alicePublicKeyBase64 = alicePublicKey.toString("base64");
const bobPublicKeyBase64 = bobPublicKey.toString("base64");

//after the server transports the publicKeys

const aliceSecret = alice.computeSecret(bobPublicKeyBase64, "base64", "hex");
const bobSecret = bob.computeSecret(alicePublicKeyBase64, "base64", "hex");
//console.log(aliceSecret == bobSecret);
//console.log(typeof Buffer.from(aliceSecret,'hex'));

//MESSAGE encryption
const MESSAGE = "Never gonna give you up.";

const encryptMessage = (MESSAGE, aliceSecret) => {
  const IV = crypto.randomBytes(16); //initialization vector
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(aliceSecret, "hex"),
    IV
  );
  let encrypted = cipher.update(MESSAGE, "utf8", "hex");
  encrypted += cipher.final("hex");
  const auth_tag = cipher.getAuthTag().toString("hex");
  console.table({
    alice_IV: IV.toString("hex"),
    alice_encrypted: encrypted,
    alice_auth_tag: auth_tag,
  });
  const payload = IV.toString("hex") + encrypted + auth_tag;
  return Buffer.from(payload, "hex").toString("base64");
};

const payload64 = encryptMessage(MESSAGE, aliceSecret);
console.log("payload", payload64);

const decryptMessage = (payload64, bobSecret) => {
  const bob_payload = Buffer.from(payload64, "base64").toString("hex");
  const bob_iv = bob_payload.substring(0, 32);
  const bob_encrypted = bob_payload.substring(32, bob_payload.length - 32);
  const bob_auth_tag = bob_payload.substring(
    bob_encrypted.length + bob_iv.length
  );
  console.table({
    bob_iv,
    bob_encrypted,
    bob_auth_tag,
  });
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(bobSecret, "hex"),
      Buffer.from(bob_iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(bob_auth_tag, "hex"));
    let decryptMessage = decipher.update(bob_encrypted, "hex", "utf8");
    decryptMessage += decipher.final("utf8");
    return decryptMessage;
  } catch (error) {
    console.log(error.message);
  }
};

let bob_message = decryptMessage(payload64, bobSecret);
console.log(bob_message);
