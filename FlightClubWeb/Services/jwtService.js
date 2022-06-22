function isTokenExpired(token) {
    const decoded = decodeJWT(token)
    const exp = decoded.exp;
    const expired = (Date.now() >= exp * 1000)
    return expired
  }

  function getTokenExpired(token) {
    const decoded = decodeJWT(token);
    const exp = decoded.exp;
    return exp;
  }
  function decodeJWT(token) {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
    const decoded = JSON.parse(decodedJson)
    return decoded;
  }

  module.exports = {
    isTokenExpired: isTokenExpired,
    getTokenExpired: getTokenExpired,
    decodeJWT: decodeJWT
  };