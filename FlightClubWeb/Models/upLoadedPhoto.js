var mongoose = require('mongoose');
const {DateTime} = require('luxon');

var Schema = mongoose.Schema;

const UpLoadedImagScema = new Schema({
    title: {type: String},
    description: {type: String},
    date: {type: Date, required: true, default: Date.now},
    img:
    {
        data: Buffer,
        contentType: String
    },
    member:{type: Schema.Types.ObjectId, ref: "Member", required: false},
});
UpLoadedImagScema
.virtual('date_formated')
.get(function() {
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});
module.exports = mongoose.model("UpLoadedImag",UpLoadedImagScema);