var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClubSchema = new Schema({
  clubAccoutn:{type: Schema.Types.ObjectId, ref: "Account"},
  accounts: [{type: Schema.Types.ObjectId, ref: "Account"}],
  
  
},{toJSON: {getters: true}})

function getDecimal(value) {
  if (typeof value !== 'undefined') {
     return parseFloat(value.toString());
  }
  return value;
};

module.exports = mongoose.model("Club", ClubSchema);