const { body } = require('express-validator');
const { DataTime, DateTime } = require('luxon');
const Member = require('../Models/member');
const log = require('debug-level').log('LoginController');
const mail = require("../Services/mailService");
const jwtService = require('../Services/jwtService');
const authJWT = require('../middleware/authJWT');

exports.signin = function(req,res,next){
    const email = req.body.email;
    const password = req.body.password;

    log.info(`login: ${email} ${password} `);
   
    Member.findOne({"contact.email" : email}, (err, member) => {
        if(err){
            console.info(`${email} Access Denied ${err}`)
        }
        if(member)
        {
            member.comparePassword(password,(err, isMatch) => {
                if(err) {
                    console.info(`${email} Access Denied comp`)
                }
                else if(isMatch){
                    
                    console.info(`${email} Access Pemitted`)
                    log.info(`${member.date_of_birth_formatted}`)
             
                    const payLoad = authJWT.payload;
                    payLoad.email = email;
                    payLoad.userId = member._id.toString();
                    payLoad.roles = member.role.roles;
                    //payLoad.id = member._id;
                    console.log("signein payload", payLoad);
                    const token = authJWT.signToken(payLoad);
                    const decodeJWT = jwtService.decodeJWT(token);
                    console.log("tokenExp" , decodeJWT.exp);
                    return res.status(201).json({
                        success: true,
                        errors: [],
                        data: {
                            access_token : token,
                            exp: decodeJWT.exp,
                            iat: new Date(decodeJWT.iat * 1000),
                            expDate: new Date(decodeJWT.exp*1000),
                            message: "Access Permited",
                            member: {
                                email: member.contact.email,
                                fullName: member.full_name}} });
                    
                }
                else{
                    console.info(`${email}  Access Denied ElseIf`)
                    log.info(member);
                    return res.status(401).json({
                         success: false,
                         errors: ["Accss Denied"],
                         message: "Access Denied" });
                }

            })
        }
        else
        {
            return res.status(201).json({ success: false, errors: ["Access Denied"], message: "Access Denied" });
        }
        
    })
    
}
exports.reset = function(req,res,next){
    const email = req.body.email;
    const phone = req.body.phone;
    console.log(email,phone);
    Member.findOne({"contact.email" : email}, (err, member) => {
        if(err){
            console.info(`${email} Not Found ${err}`)
            return res.status(401).json({ success: false, errors:[err], message: `${email} Not Found` });
        }
        if(member)
        {
            log.info(`phone: ${member.code_area_phone}`)
            var password = passwordGenrator(8);
            member.password = member.hash(password);
           member.updateOne({password: member.password}).exec((err, result) => {
               if(err){
                console.log("Update Mail Failed", err);
                return  res.status(401).json({ success: false, errors: err, message: password });
               }
               else if(result){
                   console.log("result", result)
                   mail.SendMail(member.contact.email,"Test", `Your temporary paassword is ${password}`).then((result) => {
                    console.log("Send Mail to:", member.contact.email);
                    return res.status(201).json(
                        { success: true,
                          errors: [],
                          message: password });
                   }
                    
                   ).catch((err => {
                    console.log("Send Mail");
                    return res.status(201).json({ success: false, errors:[err], message: password });
                   })

                   );
                   
               }
            
           })
           
        }
        
        else
        {
            return res.status(401).json({ success: false, errors:[err], message: `${email} Not Found` });
        }
})
}
function passwordGenrator(nChar){
    var password ="";
    const string_length = nChar
 password = [...Array(string_length)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
console.log(password);
return password;
}

function sendResetPassword(password,email){

}