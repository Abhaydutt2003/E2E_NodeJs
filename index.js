//BOTH p and g are defined by the rfc standard
const crypto = require('crypto');


const alice = crypto.getDiffieHellman('modp15');
const bob = crypto.getDiffieHellman('modp15');



let alicePublicKey = alice.generateKeys();
let bobPublicKey = bob.generateKeys();


//since these are the public keys, they will not be the same
console.log(alicePublicKey == bobPublicKey);


//once the clients recieve the public keys,
const aliceSecret = alice.computeSecret(bobPublicKey,null,'hex');
const bobSecret = bob.computeSecret(alicePublicKey,null,'hex');


console.log(aliceSecret == bobSecret);

//here you go , just transfer the pubic keys to the server





//console.log(alice.getPrime().toString('hex')); 
