const { body } = require('express-validator');
const { DataTime, DateTime } = require('luxon');
const Member = require('../Models/member');
const log = require('debug-level').log('LoginController');
const mail = require("../Services/mailService");
const jwtService = require('../Services/jwtService');
const authJWT = require('../middleware/authJWT');

exports.register = function(req,res,next){
    const email = req.body.email;
    const password = req.body.password;
    
    log.info(`register: ${email} ${password} `);
   
    Member.findOne({"contact.email" : email}, (err, member) => {
        if(err){
            
            return res.status(200).json({ success: false, errors: ["Access Denied"], message: "Access Denied" });
        }
        if(member)
        {
            return res.status(400).json({ success: false, errors: ["email already registered"], message: "email already registered" });
        }
        else
        {
            return res.status(201).json({ success: false, errors: ["Access Denied"], message: "Access Denied" });
        }
        
    })
    
}