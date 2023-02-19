var mongoose = require('mongoose');
const {OrderTypeSchema} = require('./orderType');
const Member = require('./member');
const constants = require('../Models/constants');
var ExpenseSchema = new Schema({

  date:{type: Date,required: true, default: new Date()},
  units: {type: Number, default: 0, required:true},
  pricePeUnit: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  amount: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  expense: {
    category: {type: String, required:true, default: ""},
    type: {type: String, required:true, default: ""},
    utilizated: {type: String, enum : Object.values(constants.Utilizated) , default: constants.Utilizated.HOURS_0000 }
  },
  description: {type: String,default: ""},
  status: {type:String, enum: Object.values(constants.OrderStatus), default: constants.OrderStatus.CREATED},
  source: {
    id: {type: String, required: true},
    type: {type: String, enum: Object.values(constants.MemberType), required: true,default: constants.MemberType.MEMBER},
    display: {type: String, required: true,default: ""},
    account_id: {type: String, required: true,default:""}
  },
  destination: {
    id: {type: String, required: true},
    type: {type: String, enum: Object.values(constants.MemberType) , required: true,default: constants.MemberType.MEMBER},
    display: {type: String, required: true,default: ""},
    account_id: {type: String, required: true,default:""}
  }
},{toJSON: {getters: true}})

function getDecimal(value) {
  if (typeof value !== 'undefined') {
     return parseFloat(value.toString());
  }
  return value;
};
module.exports = mongoose.model("Expense", ExpenseSchema);
