var mongoose = require('mongoose');
const constants = require('./constants');

var Schema = mongoose.Schema;

const OrderTypeSchema = new Schema({
  operation: {type: String , enum: ["Credit","Debit"], required: true, default: "Credit" }, 
  referance: {type: String , enum: ["Flight","Expense","Montly","Other"], required: true, default: "Other" } 
})

module.exports = mongoose.model('OrderType', OrderTypeSchema);