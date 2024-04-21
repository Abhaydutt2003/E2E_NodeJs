const crypto = require('crypto');



//console.log(crypto.getCurves());
//bitcoin uses the secp256k1 curve

const alice = crypto.createECDH('secp256k1');
let alicePublicKey = alice.generateKeys();

const bob = crypto.createECDH('secp256k1');
let bobPublicKey = bob.generateKeys();



const alicePublicKeyBase64 = alicePublicKey.toString('base64');
const bobPublicKeyBase64 = bobPublicKey.toString('base64');

//after the server transports the publicKeys

const aliceSecret = alice.computeSecret(bobPublicKeyBase64,'base64','hex');
const bobSecret = bob.computeSecret(alicePublicKeyBase64,'base64','hex');

console.log(aliceSecret == bobSecret);
console.log(aliceSecret);





