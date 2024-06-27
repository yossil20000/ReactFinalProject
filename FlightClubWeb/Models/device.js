var mongoose = require('mongoose');
const { DataTime } = require('luxon');

const constants = require('../Models/constants');
const CE = require('../Models/constants');
var Schema = mongoose.Schema;
var DeviceServicesSchema = new Schema( {
        date: {type: Date, default: new Date()},
        engien_meter: {type: mongoose.Decimal128, get: getDecimal , default: 10},
        type : {type: String, enum:[CE.DEVICE_MT[0],CE.DEVICE_MT[1],CE.DEVICE_MT[2],"Annual"] , default: CE.DEVICE_MT[0]},
        description: {type: String}
    },{toJSON: {getters: true}})

var DeviceSchema = new Schema({
    status:{type:String, enum: Object.values(constants.STATUS), default: constants.STATUS.Active},
    device_id: {type: String, unique: true, required: true},
    device_type: {type: Schema.Types.ObjectId , ref: 'DeviceType' },
    description: {type: String, maxLength: 200},
    available: {type: Boolean, default: false},
    device_status: {type:String,enum:[CE.DEVICE_STATUS[0],CE.DEVICE_STATUS[1],CE.DEVICE_STATUS[2],CE.DEVICE_STATUS[3]], default: CE.DEVICE_STATUS[0]},
    due_date: {type: Date, default: new Date()},
    hobbs_meter: {type: mongoose.Decimal128, get: getDecimal},
    engien_meter: {type: mongoose.Decimal128, get: getDecimal},
    engien_start_meter: {type: mongoose.Decimal128,default: 771.7, get: getDecimal},
    maintanance: {
        type : {type: String, enum:[CE.DEVICE_MT[0],CE.DEVICE_MT[1],CE.DEVICE_MT[2]] , default: CE.DEVICE_MT[0]},
        next_meter:{type: mongoose.Decimal128, get: getDecimal},
        services: [
            DeviceServicesSchema
        ]
    },
    price:{
        base: {type: mongoose.Decimal128,get: getDecimal},
        meter: {type: String, enum:[CE.DEVICE_MET.HOBBS,CE.DEVICE_MET.ENGIEN], default:CE.DEVICE_MET[1]}
    },
    details:{
        image: {type: String},
        color: {type: String},
        seats: {type: Number},
        fuel: {
            quantity: {type: Number, default: 0},
            units: {type:String, enum:['galon','litter'] , default:'galon'}
        },
        instruments: [{type: String, enum:[CE.DEVICE_INS.VFR,CE.DEVICE_INS.IFR,CE.DEVICE_INS.G1000,CE.DEVICE_INS.ICE,CE.DEVICE_INS.AIR_CONDITION]}]
    },
    location_zone:{type: String, default: "Asia/Jerusalem"},
    can_reservs:[{type: Schema.ObjectId, ref: 'Member'}],
    flights: [{type: Schema.ObjectId,ref: 'Flight'}],
    flight_reservs: [{type: Schema.ObjectId, ref: 'FlightReservation'}],
    has_hobbs: {type: Boolean, default: false}
},{toJSON: {getters: true}});

function getDecimal(value) {
    if (typeof value !== 'undefined') {
       return parseFloat(value.toString());
    }
    return value;
};
module.exports = mongoose.model('Device', DeviceSchema);