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
const MESSAGE = 'Never gonna give you up.';

const encryptMessage = (MESSAGE,aliceSecret)=>{
    const IV = crypto.randomBytes(16);//initialization vector
    const cipher =  crypto.createCipheriv('aes-256-gcm',Buffer.from(aliceSecret,'hex'),IV);
    let encrypted = cipher.update(MESSAGE,'utf8','hex');
    encrypted += cipher.final('hex');
    const auth_tag = cipher.getAuthTag().toString('hex');
    console.table({
        IV:IV.toString('hex'),
        encrypted:encrypted,
        auth_tag:auth_tag
    });
    const payload = IV.toString('hex')+encrypted+auth_tag;
    return Buffer.from(payload,'hex').toString('base64');
}

const payload64 = encryptMessage(MESSAGE,aliceSecret);

const decryptMessage = (encryptedMessage,bobSecret)=>{
    
}







