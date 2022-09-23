var mongoose = require('mongoose');
const {  DateTime } = require('luxon');

var Schema = mongoose.Schema;
var FlightReservationSchema = new Schema({
    date_from: {type: Date, required: true, default: Date.now},
    date_to: {type: Date, required: true, default: Date.now},
    notification:{
        type: {type: String, enum:["email","sms"]},
        notify: {type: Boolean}
    },
    member: {type: Schema.Types.ObjectId, ref: 'Member', required: true},
    device: {type: Schema.Types.ObjectId, ref: 'Device', required: true},
    
},{timestamps: true});
// virtual
FlightReservationSchema
.virtual('date_from_formatted')
.get(function () {
    return DateTime.fromJSDate(this.date_from).toLocaleString(DateTime.DATE_MED);
});

FlightReservationSchema
.virtual('url')
.get( function () {
    return '/reservation/'+this._id;
});

FlightReservationSchema.pre('remove', async function(next){
    await this.model('Member').updateMany(
        {flight_reservs: this._id},
        {$pull: {flight_reservs: this._id}},
        {multi: true},
        next
    )
});
module.exports = mongoose.model('FlightReservation', FlightReservationSchema);