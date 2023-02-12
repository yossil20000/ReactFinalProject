var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const OrderTypeSchema = new Schema({
  operation: {type: String , enum: ["Credit","Debit"], required: true, default: "Credit" }, 
  referance: {type: String , enum: ["Flight","Expense","Montly","Other"], required: true, default: "Other" } 
})
const SelectionTypeSchema = new Schema({
  key: {type: String ,unique: true,  default: "Expense", set: setUpper},
  values: {type: [String] ,unique: true,default:["AnnualTest","Insurance","Other","Parts","Repair","Fuel","Oil","AirpotTax"], set: setUpperArray} 
})

function setUpper(value) {
  return value.toUpperCase();
}
function setUpperArray(values){
  return values.map((i) => i.toUpperCase());
}
const OrderType = mongoose.model('OrderType', OrderTypeSchema);
const SelectionType = mongoose.model('SelectionType', SelectionTypeSchema);

module.exports = {
  OrderType: OrderType,
  OrderTypeSchema: OrderTypeSchema,
  SelectionTypeSchema:SelectionTypeSchema,
  SelectionType:SelectionType
}