var mongoose = require('mongoose');
const constants = require('../Models/constants');
const {Transaction,TransactionSchema} = require('../Models/transaction')

var Schema = mongoose.Schema;
var ClubSchema = new Schema({
  account_id: { type: String, required: true, unique: true },
  brand: { type: String, required: true, default: "BAZ", uppercase: true },
  branch: { type: String, required: true, default: "HAIFA", uppercase: true }
})
var AccountSavingSchema = new Schema({
  id: { type: String, required: true, unique: true ,uppercase: true, default: "ENGINE"},
  balance: { type: mongoose.Decimal128, default: 0, get: getDecimal },
  description: { type: String, required: true, default: "Engiene Replacment" }
},{toJSON: {getters: true}})
var ClubAccountSchema = new Schema({
  accounts: [{ type: Schema.Types.ObjectId, ref: "Account", unique: true }],
  transactions: [TransactionSchema],
  balance: { type: mongoose.Decimal128, default: 0, get: getDecimal },
  account_saving: [AccountSavingSchema],
  description: { type: String },
  status: { type: String, enum: Object.values(constants.STATUS), default: constants.STATUS.Active },
  club: ClubSchema,
  contact: {
    address: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
      city: { type: String, default: "Haifa" },
      postcode: { type: String, default: "000000" },
      province: { type: String, default: "" },
      state: { type: String, default: "Israel" }
    },
    phone: {
      country: { type: String, default: "972" },
      area: { type: String, default: "054" },
      number: { type: String, default: "" }
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "flightclub972@gmail.com",
      required: [true, "email not provided"],
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: `{VALUE} is not valid email!`
      }
    }
  }
}, { toJSON: { getters: true } })

function getDecimal(value) {
  if (typeof value !== 'undefined') {
    return parseFloat(value.toString());
  }
  return value;
};

module.exports = mongoose.model("ClubAccount", ClubAccountSchema);
