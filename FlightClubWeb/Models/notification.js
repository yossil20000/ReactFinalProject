var mongoose = require('mongoose');
const constants = require('../Models/constants');
var Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  member: {
    _id: {type: String, required: true},
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true}
  },
  enabled: {type: Boolean , default: false},
  flight: {
    enabled: {type: Boolean, default: false},
    notifyWhen: [{type: String, enum: Object.values(constants.NotifyOn) ,default: []}],
    notifyBy: [{type: String, enum: Object.values(constants.NotifyBy), default: constants.NotifyBy.EMAIL}]
  },
  reservation: {
    enabled: {type: Boolean, default: false},
    notifyWhen: [{type: String, enum: Object.values(constants.NotifyOn) ,default: []}],
    notifyBy: [{type: String, enum: Object.values(constants.NotifyBy), default: constants.NotifyBy.EMAIL}]
  }
})
module.exports = mongoose.model("Notification", NotificationSchema);