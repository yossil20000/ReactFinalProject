const crypto = require("crypto");
//const creyptoKeys = getcreyptoKeys();
//console.log("creyptedKeys", creyptoKeys);
const getcreyptoKeys = function () {
    const keys = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: 'top-secret'
        }
    });
    /*     console.log(
            keys.publicKey.export({
                type: 'spki',
                format: "pem",
            }),
        
            keys.privateKey.export({
                type: "pkcs1",
                format: "pem",
            })) */
    return keys;
}


const encryptedData = function (publicKey, data) {
    const encrypted = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        // We convert the data string to a buffer using `Buffer.from`
        Buffer.from(data)
      );
      
      // The encrypted data is in the form of bytes, so we print it in base64 format
      // so that it's displayed in a more readable form
      console.log("encypted data: ", encrypted.toString("base64"));
    return encrypted;
}

const decryptedData = function (privateKey, encryptedData) {
    const decrypted = crypto.privateDecrypt(
        {
          key: privateKey.toString(),
          passphrase: 'top-secret',
          // In order to decrypt the data, we need to specify the
          // same hashing function and padding scheme that we used to
          // encrypt the data in the previous step
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        encryptedData
      );
      
      // The decrypted data is of the Buffer type, which we can convert to a
      // string to reveal the original data
      console.log("decrypted data: ", decrypted.toString());
    return decrypted.toString();
}
module.exports = {
    getcreyptoKeys: getcreyptoKeys,
    encryptedData: encryptedData,
    decryptedData: decryptedData
}
