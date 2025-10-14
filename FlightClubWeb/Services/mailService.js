require('dotenv').config();
const log = require('debug-level').log('mailService');
var express = require('express');
const nodemailer = require('nodemailer');

const Q = require('q');
let sender = {
    service: "gmail",
    port: 587, // Or 465 for SSL/TLS
    secure: false, // Use 'true' for port 465, 'false' for 587 with STARTTLS
    auth:{
        user: "flight.club.972@gmail.com",
        pass: "ngoglfjbapqkpoai"
    }
};
let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587, // Or 465 for SSL/TLS
    secure: false, // Use 'true' for port 465, 'false' for 587 with STARTTLS
    auth:{
        user: process.env.SITE_MAIL,
        pass: process.env.nodemailer,
    }
});

let mailOption = {
    from:  process.env.SITE_MAIL,
    to: "",
    subject: "",
    text: "",
    html:'<h1>Hello</h1>'
}


function SendMail(to,subject,text,html='<h1>Hello Club Member</h1>'){
    return new Promise((resolve, reject) => {
        mailOption.to = `yos.1965@gmail.com;${to};${process.env.SITE_MAIL}`;
        mailOption.subject = subject;
        mailOption.text = text;
        mailOption.html = `${html}<p>${text}</p>`;
        if(process.env.DONT_SEND_MAIL && process.env.DONT_SEND_MAIL.toLowerCase() === 'true'){
            log.warn("DONT_SEND_MAIL is true - Mail not sent");
            resolve("DONT_SEND_MAIL is true - Mail not sent");
            return;
        }
        transporter.sendMail(mailOption, function(err,success) {
            log.info(sender);
            if(err){
                log.error(err);
                reject(err);
            }
            else
            {
                log.info(success);
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
    if(process.env.DONT_SEND_MAIL && process.env.DONT_SEND_MAIL.toLowerCase() === 'true'){
            log.warn("DONT_SEND_MAIL is true - Mail not sent");
            resolve("DONT_SEND_MAIL is true - Mail not sent");
            return;
     }
    transporter.sendMail(mailOption, function(err,success) {
    if(err){
        log.error(err);
        deferred.reject(err);
    }
    else
    {
        log.log(success);
        deferred.resolve(success);
    }
    deferred.promise.nodeify(callback);
    return deferred.promise;
});

}
async function SendMailRecipe(to, subject,text,pdf, callback){
    const deferred = Q.defer();
    mailOption.to = to;
    mailOption.subject = subject;
    mailOption.text = text;
    mailOption.html = `<h1>Hello ${to}</h1><p>${text}</p><h1>Attached  File: ${pdf}</h1>`
    mailOption.attachments =[
        {
            filename: pdf, // <= Here: made sure file name match
            path: pdf, // <= Here
            contentType: 'application/pdf'
        }
    ]
    if(process.env.DONT_SEND_MAIL && process.env.DONT_SEND_MAIL.toLowerCase() === 'true'){
            log.warn("DONT_SEND_MAIL is true - Mail not sent");
            resolve("DONT_SEND_MAIL is true - Mail not sent");
            return;
        }
    transporter.sendMail(mailOption, function(err,success) {
    if(err){
        log.error(err);
        deferred.reject(err);
    }
    else
    {
        log.log(success);
        deferred.resolve(success);
    }
    deferred.promise.nodeify(callback);
    return deferred.promise;
});

}
module.exports = {
    SendMail: SendMail,
    SendMailQ : SendMailQ,
    SendMailRecipe: SendMailRecipe
} ;
transporter.verify().then(e => log.log(e)).catch(err => log.error(err));
