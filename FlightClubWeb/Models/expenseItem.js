var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const constants = require('../Models/constants');

var ExpenseItemSchema = new Schema({
  item_name: {type: String, unique: true, required:true, default: ""},
  expense: {
      category: {type: String, required:true, default: ""},
      type: {type: String, required:true, default: ""},
      utilizated: {type: String, enum : Object.values(constants.Utilizated) , default: constants.Utilizated.HOURS_0000 }
    }
  }
  ,{toJSON: {getters: true}})
module.exports = mongoose.model("ExpenseItem", ExpenseItemSchema);

