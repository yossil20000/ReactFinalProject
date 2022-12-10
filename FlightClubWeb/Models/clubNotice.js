var mongoose = require('mongoose');
const {DateTime} = require('luxon');
const { body } = require('express-validator');

var Schema = mongoose.Schema;

const ClubNoticeScema = new Schema({
    title: {type: String},
    description: {type: String},
    issue_date: {type: Date, required: true, default: Date.now},
    due_date: {type: Date},
    isExpired: {type: Boolean, default: false},
    isPublic: {type: Boolean, default: false}
    
});
ClubNoticeScema
.virtual('issue_date_formated')
.get(function() {
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});
ClubNoticeScema
.virtual('due_date_formated')
.get(function() {
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});
module.exports = mongoose.model("ClubNotice",ClubNoticeScema);