var mongoose = require('mongoose');
const { DataTime } = require('luxon');

const constants = require('../Models/constants');
const CE = require('../Models/constants');
const account = require('./account');
require('../Models/clubAccount')
var Schema = mongoose.Schema;
var DeviceServicesSchema = new Schema( {
        date: {type: Date, default: new Date()},
        engien_meter: {type: mongoose.Decimal128, get: getDecimal , default: 10},
        type : {type: String, enum:[CE.DEVICE_MT[0],CE.DEVICE_MT[1],CE.DEVICE_MT[2],"Annual"] , default: CE.DEVICE_MT[0]},
        description: {type: String}
    },{toJSON: {getters: true}})

/**
 * DeviceSchema defines the structure for device documents in the database.
 *
 * @typedef {Object} Device
 * @property {string} status - Device status, must be one of constants.STATUS values. Default: Active.
 * @property {string} device_id - Unique identifier for the device. Required.
 * @property {ObjectId} device_type - Reference to DeviceType.
 * @property {string} [description] - Description of the device (max 200 chars).
 * @property {boolean} [available=false] - Availability status.
 * @property {string} device_status - Device operational status, must be one of CE.DEVICE_STATUS values.
 * @property {Date} [due_date] - Annual Inspection Due date for device, defaults to current date.
 * @property {mongoose.Decimal128} [hobbs_meter] - Hobbs meter reading.
 * @property {mongoose.Decimal128} [engien_meter] - Engine meter reading.
 * @property {mongoose.Decimal128} [engien_start_meter=771.7] - Engine start meter reading.
 * @property {Object} maintanance - Maintenance information.
 * @property {string} maintanance.type - Maintenance type, must be one of CE.DEVICE_MT values.
 * @property {mongoose.Decimal128} [maintanance.next_meter] - Next maintenance meter reading.
 * @property {DeviceServicesSchema[]} [maintanance.services] - List of maintenance services.
 * @property {Object} price - Pricing information.
 * @property {mongoose.Decimal128} [price.base] - Base price.
 * @property {string} price.meter - Meter type, must be HOBBS or ENGIEN.
 * @property {mongoose.Decimal128} [price.engine_fund=120] - Engine fund amount.
 * @property {Object} details - Additional device details.
 * @property {string} [details.image] - Image URL.
 * @property {string} [details.color] - Device color.
 * @property {number} [details.seats] - Number of seats.
 * @property {Object} details.fuel - Fuel information.
 * @property {number} [details.fuel.quantity=0] - Fuel quantity.
 * @property {string} [details.fuel.units='galon'] - Fuel units, either 'galon' or 'litter'.
 * @property {string[]} [details.instruments] - List of instrument types.
 * @property {string} [location_zone="Asia/Jerusalem"] - Location time zone.
 * @property {ObjectId[]} [can_reservs] - Members who can reserve the device.
 * @property {ObjectId[]} [flights] - Associated flights.
 * @property {ObjectId[]} [flight_reservs] - Associated flight reservations.
 * @property {boolean} [has_hobbs=false] - Indicates if device has a Hobbs meter.
 * @property {ObjectId} [account_owner] - Reference to ClubAccount owner.
 */
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
        next_meter_tollerance:{type: mongoose.Decimal128,default: 0, get: getDecimal},
        services: [
            DeviceServicesSchema
        ]
    },
    price:{
        base: {type: mongoose.Decimal128,get: getDecimal},
        meter: {type: String, enum:[CE.DEVICE_MET.HOBBS,CE.DEVICE_MET.ENGIEN], default:CE.DEVICE_MET[1]},
        engine_fund: {type: mongoose.Decimal128, get: getDecimal, default: 120},
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
    has_hobbs: {type: Boolean, default: false},
    account_owner: {type: Schema.ObjectId, ref: 'ClubAccount'}
},{toJSON: {getters: true}});

function getDecimal(value) {
    if (typeof value !== 'undefined') {
       return parseFloat(value.toString());
    }
    return value;
};
module.exports = mongoose.model('Device', DeviceSchema);