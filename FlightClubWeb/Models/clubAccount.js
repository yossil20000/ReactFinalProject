var mongoose = require('mongoose');
const constants = require('../Models/constants');
var Schema = mongoose.Schema;

var ClubAccountSchema = new Schema({
  account_id: {type: String, required: true},
  accounts: {type: Schema.Types.ObjectId, ref: "Account", required: true},
  transactions: [{type: Schema.Types.ObjectId, ref: "Transaction"}],
  balance: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  desctiption: {type: String},
  status:{type:String, enum: Object.values(constants.STATUS), default: constants.STATUS.Active},
},{toJSON: {getters: true}})

function getDecimal(value) {
  if (typeof value !== 'undefined') {
     return parseFloat(value.toString());
  }
  return value;
};

module.exports = mongoose.model("ClubAccount", ClubAccountSchema);