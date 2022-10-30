var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
  account_id: {type: String, required: true},
  member: {type: Schema.Types.ObjectId, ref: "Member", required: true},
  transactions: [{type: Schema.Types.ObjectId, ref: "Transaction"}],
  balance: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  desctiption: {type: String}
},{toJSON: {getters: true}})

function getDecimal(value) {
  if (typeof value !== 'undefined') {
     return parseFloat(value.toString());
  }
  return value;
};

module.exports = mongoose.model("Account", AccountSchema);