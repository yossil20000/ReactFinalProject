const { default: mongoose } = require('mongoose');
const m = require('mongoose');

const Schema = m.Schema;
const MembershipSchema = new Schema({
    entry_price: {type: m.Decimal128 , default: 18950},
    montly_price: {type: m.Decimal128, default: 430},
    hour_disc_percet: {type: Number, default: 100},
    rank: {type: String, enum:['Bronze','Silver','Gold'], default: "Bronze"},
    status: {type: String, enum:['Created','Active','Susspende'] , default: 'Created'}
});

module.exports = m.model('Membership', MembershipSchema);