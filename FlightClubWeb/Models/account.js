var mongoose = require('mongoose');
const constants = require('../Models/constants');
require('../Models/transaction')
var Schema = mongoose.Schema;

const AccountSchema = new Schema({
  account_id: {type: String, required: true},
  member: {type: Schema.Types.ObjectId, ref: "Member", required: true},
  transactions:[ {type: Schema.Types.ObjectId, ref: "Transaction", required: true}],
  balance: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  engine_fund_balance: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  description: {type: String},
  status:{type:String, enum: Object.values(constants.STATUS), default: constants.STATUS.Active},
},{toJSON: {getters: true}})

function getDecimal(value) {
  if (typeof value !== 'undefined') {
     return parseFloat(value.toString());
  }
  return value;
};
const Account = mongoose.model("Account", AccountSchema);

module.exports = {
  Account: Account,
  AccountSchema: AccountSchema
}