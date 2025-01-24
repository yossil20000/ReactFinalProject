const mongoose = require('mongoose');
function convertDecimal128ToNumber(decimal128) {
  if (decimal128 instanceof mongoose.Types.Decimal128) {
    return decimal128.toString(); 
  } else {
    return decimal128; 
  }
}


function convertDecimal128ArrayToNumbers(decimalArray) {
  try {
    const numberArray = decimalArray.map(decimal => {
      if (decimal instanceof mongoose.Types.Decimal128) {
        return decimal.toString(); // Convert Decimal128 to string
      } else {
        return decimal; // If not Decimal128, keep as is
      }
    }).map(Number); // Convert strings to numbers

    return numberArray;
  } catch (error) {
    console.error('Error converting Decimal128 array to numbers:', error);
    return null;
  }
}
module.exports = {
  convertDecimal128ToNumber,
  convertDecimal128ArrayToNumbers

}
