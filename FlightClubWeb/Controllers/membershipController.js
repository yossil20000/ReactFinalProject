const Membership = require('../Models/membership');

const log = require('debug-level').log('membershipController');


exports.membership_list = function(req,res,next){
    log.info("membership_list");
    Membership.find()
    .exec(function(err,list_memberships) {
        if(err){
            res.status(400).json({success: false, errors :[err], data: []});
            return;
        }
        else{
            res.status(201).json({success: true, errors:[], data: list_memberships})
        }
    })
}