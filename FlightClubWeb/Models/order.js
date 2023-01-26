var mongoose = require('mongoose');
const OrderType = require('./orderType');
const Member = require('./member');
const constants = require('../Models/constants');
var Schema = mongoose.Schema;
var OrderTypeSchema = new Schema({
  operation: {type: String , enum: ["Credit","Debit"], required: true, default: "Credit" }, 
  referance: {type: String , enum: ["Flight","Expense","Montly","Other"], required: true, default: "Other" } 
})
var OrderSchema = new Schema({

  order_date:{type: Date,required: true},
  product:  {type: Schema.Types.ObjectId,required: true},
  units: {type: Number, default: 0, required:true},
  pricePeUnit: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  amount: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  orderType: OrderTypeSchema,
  desctiption: {type: String},
  status: {type:String, enum: Object.values(constants.OrderStatus), default: constants.OrderStatus.CREATED},
  member: {type: Schema.Types.ObjectId,ref: Member, required:true}
},{toJSON: {getters: true}})

function getDecimal(value) {
  if (typeof value !== 'undefined') {
     return parseFloat(value.toString());
  }
  return value;
};

module.exports = mongoose.model("Order", OrderSchema);