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
        mail.SendMail(item.member.email,`Notification: ${event} ${notifyWhen}` ,`Hello ${item.member.fullName} \n ${message}` )
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

exports.sendNotification = sendNotification