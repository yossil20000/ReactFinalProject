const constants = require('../Models/constants');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/* export interface IPaymentRecipe {
  format: string;
  companyId: string;
  companyName: string;
  phone: string;
  email: string;
  to: string;
  reciepeId: string;
  date: Date;
  accountId: string;
  cardId: string;
  bank: string;
  branch: string;
  amount: number;
  tax: number;
  description: string
  referance: string

} */
var TransactionSchema = new Schema({
  source: {type: String, required: true},
  destination: {type: String, required: true},
  amount: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  engine_fund_amount: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  source_balance: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  destination_balance: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  order:  {
    _id: {type: String},
    type: {type: String},
    quarter: {type:String,enum: Object.values(constants.QuarterType),default: constants.QuarterType.NONE}
  },
  type: {type: String, enum: Object.values(constants.TransactionType), default: constants.TransactionType.CREDIT},
  calculation_type: {type: String, enum: Object.values(constants.CalcType), default: constants.CalcType.TRANSACTION},
  payment:{
    method: {type:String, enum: Object.values(constants.PaymentMethod),default: constants.PaymentMethod.TRANSFER},
    referance: {type: String, default: ""}
  },
  description: {type: String},
  date: {type: Date, default: new Date()}
},{toJSON: {getters: true}})

function getDecimal(value) {
  if (typeof value !== 'undefined') {
     return parseFloat(value.toString());
  }
  return value;
};
const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = {
  Transaction: Transaction,
  TransactionSchema: TransactionSchema
}