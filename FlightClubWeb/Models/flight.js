var mongoose = require('mongoose');
const { DataTime } = require('luxon');

var Schema = mongoose.Schema;
//#region FlightSchema
var FlightSchema = new Schema({
    description: {type: String},
    date: {type: Date, required: true, default: Date.now},
    hobbs_start: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
    hobbs_stop: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
    engien_start: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
    engien_stop: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
    status: {type: String, enum:["CREATED","CLOSE","PAYED"],default: "CREATED"},
    device: {type: Schema.Types.ObjectId, ref: 'Device', required: true},
    member: {type: Schema.Types.ObjectId, ref: 'Member' , required: true},
    reuired_hobbs: {type: Schema.Types.Boolean, default: false},
    duration: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
    flight_time: {type: mongoose.Decimal128 ,default: 0, get: getDecimal},
    timeOffset: {type: Schema.Types.Decimal128,get: getDecimal}
},{toJSON: {getters: true}});
//#endregion
function getDecimal(value) {
    if (typeof value !== 'undefined') {
       return parseFloat(value.toString());
    }
    return value;
};
module.exports = mongoose.model('Flight', FlightSchema);