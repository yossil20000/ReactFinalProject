var mongoose = require('mongoose');
const { DataTime } = require('luxon');

var Schema = mongoose.Schema;

var FlightSchema = new Schema({
    description: {type: String},
    date_from: {type: Date, required: true, default: Date.now},
    date_to: {type: Date, required: true, default: Date.now},
    hobbs_start: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
    hobbs_stop: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
    engien_start: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
    engien_stop: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
    status: {type: String, enum:["CREATED","CLOSE","PAYED"],default: "CREATED"},
    device: {type: Schema.Types.ObjectId, ref: 'Device', required: true},
    member: {type: Schema.Types.ObjectId, ref: 'Member' , required: true},
    timeOffset: {type: Schema.Types.Decimal128,get: getDecimal}
},{toJSON: {getters: true}});

function getDecimal(value) {
    if (typeof value !== 'undefined') {
       return parseFloat(value.toString());
    }
    return value;
};
module.exports = mongoose.model('Flight', FlightSchema);