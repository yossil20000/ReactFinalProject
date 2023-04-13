const RSAEncrypt = require('./Services/RSAEncrypt');
var log = require('debug-level').log('encryptedData');
const { publicKey, privateKey } = RSAEncrypt.getcreyptoKeys();
log.info("public:" , publicKey);
log.info("private:" , privateKey);

const data = "I am a pilot";
const decrypData = RSAEncrypt.encryptedData(publicKey,data); 
log.info("encypted data: ", decrypData.toString("base64"));

log.info("encypted data: ", RSAEncrypt.decryptedData(privateKey,decrypData));