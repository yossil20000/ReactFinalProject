var mongoose = require('mongoose');
const {OrderTypeSchema} = require('./orderType');
const Member = require('./member');
const constants = require('../Models/constants');
var ExpenseSchema = new Schema({

  date:{type: Date,required: true, default: new Date()},
  units: {type: Number, default: 0, required:true},
  pricePeUnit: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  amount: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  expense: {type: String, required:true, default: ""},
  description: {type: String},
  status: {type:String, enum: Object.values(constants.OrderStatus), default: constants.OrderStatus.CREATED},
  source: {
    id: {type: String, required: true},
    type: {type: String, enum: Object.values(constants.EAccountType), required: true}
  },
  destination: {
    id: {type: String, required: true},
    type: {type: String, enum: Object.values(constants.EAccountType) , required: true}
  }
},{toJSON: {getters: true}})

function getDecimal(value) {
  if (typeof value !== 'undefined') {
     return parseFloat(value.toString());
  }
  return value;
};
module.exports = mongoose.model("Expense", ExpenseSchema);
