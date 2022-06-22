const Membership = require('../Models/membership');

const async = require('async');
const log = require('debug-level').log('membershipController');

var {body,validationResult} = require('express-validator');

exports.membership_list = function(req,res,next){
    log.info("membership_list");
    Membership.find()
    .exec(function(err,list_memberships) {
        if(err){
            res.status(401).json({success: false, errors :[err], data: []});
            return;
        }
        else{
            res.status(201).json({success: true, errors:[], data: list_memberships})
        }
    })
}