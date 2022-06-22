var mongoose = require('mongoose');
const constants = require('./constants');

var Schema = mongoose.Schema;

const RoleSchema = new Schema({
    roles: [{type: String , enum: [constants.ROLES[0],constants.ROLES[1],constants.ROLES[2],constants.ROLES[3]], required: true, default: constants.ROLES[0] }] 
})

module.exports = mongoose.model('Role', RoleSchema);