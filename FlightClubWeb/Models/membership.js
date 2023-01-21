
const m = require('mongoose');

const Schema = m.Schema;
const MembershipSchema = new Schema({
    name: {
        type: String,
         required: true,
         default: "Normal",
         index: {unique:[true , "name already exist in database"]},
        },
    entry_price: {type: m.Decimal128 , default: 18950,get: getDecimal},
    montly_price: {type: m.Decimal128, default: 430,get: getDecimal},
    hour_disc_percet: {type: Number, default: 100},
    rank: {type: String, enum:['Bronze','Silver','Gold'], default: "Bronze"}
},{toJSON: {getters: true}});

function getDecimal(value) {
    if (typeof value !== 'undefined') {
       return parseFloat(value.toString());
    }
    return value;
};
module.exports = m.model('Membership', MembershipSchema);