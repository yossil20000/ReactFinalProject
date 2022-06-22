var mongoose = require('mongoose');
const { DataTime } = require('luxon');

var Schema = mongoose.Schema;

var FlightSchema = new Schema({
    
    hobbs_start: {type: mongoose.Decimal128 },
    hobbs_stop: {type: mongoose.Decimal128},
    engien_start: {type: mongoose.Decimal128},
    engien_stop: {type: mongoose.Decimal128},
    status: {type: String, enum:["CREATED","OPEN","CLOSE"]},
    device: {type: Schema.Types.ObjectId, ref: 'Device', required: true},
    member: {type: Schema.Types.ObjectId, ref: 'FlightReservation' , required: true}

});

module.exports = mongoose.model('Flight', FlightSchema);