require('dotenv').config();
var express = require('express');
const nodemailer = require('nodemailer');
const Q = require('q');
let sender = {
    service: "gmail",
    auth:{
        user: "flight.club.972@gmail.com",
        pass: "ngoglfjbapqkpoai"
    }
};
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.SITE_MAIL,
        pass: process.env.nodemailer,
    }
});

let mailOption = {
    from:  process.env.SITE_MAIL,
    to: "",
    subject: "",
    text: ""
}


function SendMail(to,subject,text){
    return new Promise((resolve, reject) => {
        mailOption.to = "yos.1965@gmail.com";
        mailOption.subject = subject;
        mailOption.text = text;
        transporter.sendMail(mailOption, function(err,success) {
            console.log(sender);
            if(err){
                console.log(err);
                reject(err);
            }
            else
            {
                console.log(success);
                resolve(success);
            }
        });
    });
}
//https://mono.software/2014/07/07/Creating-NodeJS-modules-with-both-promise-and-callback-API-support-using-Q/
function SendMailQ(to, subject,text, callback){
    const deferred = Q.defer();
    mailOption.to = to;
    mailOption.subject = subject;
    mailOption.text = text;
    transporter.sendMail(mailOption, function(err,success) {
    if(err){
        console.log(err);
        deferred.reject(err);
    }
    else
    {
        console.log(success);
        deferred.resolve(success);
    }
    deferred.promise.nodeify(callback);
    return deferred.promise;
});

}
module.exports = {
    SendMail: SendMail,
    SendMailQ : SendMailQ
} ;
transporter.verify().then(e => console.log(e)).catch(err => console.log(err));
