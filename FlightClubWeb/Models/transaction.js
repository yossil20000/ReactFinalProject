var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
  source: {type: String, required: true},
  destination: {type: String, required: true},
  amount: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  order:  {type: Schema.Types.ObjectId, ref: "Order", required: true},
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