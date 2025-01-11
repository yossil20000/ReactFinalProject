const e = require("express");
const Notification = require("../Models/notification");
const log = require('debug-level').log('notificationService');
const mail = require("../Services/mailService");
const sendNotification =  async (event,notifyWhen,message) => {

  try{
    const aggregate = Notification.aggregate();
    const filter = {
      "filter":{
          "$and": [{"notify.enabled": true},{"notify.event": event},{"notify.notifyWhen": notifyWhen}]
      },
      "select":  "member"
  } 
      const results = await aggregate.unwind('$notify').match(filter.filter).project(filter.select)
      .exec();
      results.forEach((item) => {
        mail.SendMail(item.member.email,`Notification: ${event} ${notifyWhen}` ,``,`<h1>Hello ${item.member.fullName}</h1>${message}` )
        .then(() => {
          log.info("Send Mail to:", item.member.email);
           
        }).catch((err => {
          log.error("Send Mail to: error",err, item.member.email);
        }));
      })
      return results;
     
    }
  catch(error){
    return undefined;
  }
  finally{

  }
}

const sendAdmniNotification = async (subject,message) => {
  mail.SendMail(process.env.SITE_MAIL,`Notification:  ${subject}` ,`Hello ${process.env.SITE_MAIL} \n ${message}` )
        .then(() => {
          log.info("Send Mail to:",process.env.SITE_MAIL);
           
        }).catch((err => {
          log.error("Send Mail to: error",err, process.env.SITE_MAIL);
        }));
}
exports.sendNotification = sendNotification
exports.sendAdmniNotification = sendAdmniNotification; 