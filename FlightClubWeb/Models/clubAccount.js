var mongoose = require('mongoose');
const constants = require('../Models/constants');
var Schema = mongoose.Schema;

var ClubAccountSchema = new Schema({
  account_id: {type: String, required: true,unique:true},
  accounts: [{type: Schema.Types.ObjectId, ref: "Account"}],
  transactions: [{type: Schema.Types.ObjectId, ref: "Transaction"}],
  balance: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
  desctiption: {type: String},
  status:{type:String, enum: Object.values(constants.STATUS), default: constants.STATUS.Active},
  club:{
    brand: {type: String, required: true ,default: "BAZ",uppercase: true},
    branch: {type: String, required: true,default: "HAIFA",uppercase: true},
  },
  contact:{
    address: {
        line1: {type: String, default: ""},
        line2: {type: String, default: ""},
        city: {type: String, default: "Haifa"},
        postcode: {type: String , default: "000000"},
        province: {type: String, default: ""},
        state: {type: String,default: "Israel"}
    },
    phone: {
        country:{type: String, default: "972"},
        area: {type: String, default: "054"},
        number: {type: String, default: ""}
    },
    email: {
        type: String,
        lowercase: true ,
        trim: true,
        default: "flightclub972@gmail.com",
        required: [true,"email not provided"],
        validate:{
            validator: function(v){
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: `{VALUE} is not valid email!`
        }
    }}
},{toJSON: {getters: true}})

function getDecimal(value) {
  if (typeof value !== 'undefined') {
     return parseFloat(value.toString());
  }
  return value;
};

module.exports = mongoose.model("ClubAccount", ClubAccountSchema);