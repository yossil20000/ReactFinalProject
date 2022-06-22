const RSAEncrypt = require('./Services/RSAEncrypt');
const { publicKey, privateKey } = RSAEncrypt.getcreyptoKeys();
console.log("public:" , publicKey);
console.log("private:" , privateKey);

const data = "I am a pilot";
const decrypData = RSAEncrypt.encryptedData(publicKey,data); 
console.log("encypted data: ", decrypData.toString("base64"));

console.log("encypted data: ", RSAEncrypt.decryptedData(privateKey,decrypData));