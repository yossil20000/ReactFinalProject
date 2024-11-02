var mongoose = require('mongoose');
const {  DateTime } = require('luxon');

var Schema = mongoose.Schema;
var FlightReservationSchema = new Schema({
    date_from: {type: Date, required: true, default: Date.now},
    date_to: {type: Date, required: true, default: Date.now},
    notification: [{type: Schema.Types.ObjectId, ref: 'Member'}],
    member: {type: Schema.Types.ObjectId, ref: 'Member', required: true},
    device: {type: Schema.Types.ObjectId, ref: 'Device', required: true},
    timeOffset: {type: Schema.Types.Decimal128,get: getDecimal},
    time_from: {type: Schema.Types.Number,default: new Date(1970,1,1).getTime()},
    time_to: {type: Schema.Types.Number,default: new Date(1970,1,1).getTime()}
},{timestamps: true,toJSON: {getters: true}});

function getDecimal(value) {
    if (typeof value !== 'undefined') {
       return parseFloat(value.toString());
    }
    return value;
};
// virtual
FlightReservationSchema
.virtual('date_from_formatted')
.get(function () {
    return DateTime.fromJSDate(this.date_from).toLocaleString(DateTime.DATE_MED);
});
FlightReservationSchema.virtual("flightNotification",{ref: 'Device',localField: "device",foreignField: '_id'})
.get(function () {
    return `Flight from ${this.date_from} to: ${this.date_to} \n on device: ${this.device.device_id}`
})
FlightReservationSchema
.virtual('url')
.get( function () {
    return '/reservation/'+this._id;
});

FlightReservationSchema.pre('remove', async function(next){
    await this.model('Member').updateOne(
        {flight_reservs: this._id},
        {$pull: {flight_reservs: this._id}},
       
        next
    )
});
module.exports = mongoose.model('FlightReservation', FlightReservationSchema);