var mongoose = require('mongoose');
const OrderTypeSchema = require('./orderType').OrderTypeSchema;

var Schema = mongoose.Schema;

var OrderSchema = new Schema({

  order_date:{type: Date,required: true},
  products:  [{type: Schema.Types.ObjectId, ref: "Product", required: true}],
  units: {type: Number, required:true},
  pricePeUnit: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  amount: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  orderType: OrderTypeSchema,
  desctiption: {type: String},

},{toJSON: {getters: true}})

function getDecimal(value) {
  if (typeof value !== 'undefined') {
     return parseFloat(value.toString());
  }
  return value;
};

module.exports = mongoose.model("Order", OrderSchema);