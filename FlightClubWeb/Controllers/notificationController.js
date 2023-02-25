const log = require('debug-level').log('NotificationController');
const { body, param, validationResult } = require('express-validator');
const { ApplicationError } = require('../middleware/baseErrors');
const Notification = require('../Models/notification');
const constants = require('../Models/constants');

exports.notification_list = function (req, res, next) {
  try {
    log.info('notice_list/req', req.body);
    Notification.find()
      .exec(function (err, list_notification) {
        if (err) {
          log.debug(err);
          return next(err);
        }
        else {
          log.info('notice_list/results', list_notification.length);
          res.status(201).json({ success: true, errors: [], data: list_notification });
          return;
        }
      });
  }
  catch (error) {
    return next(new ApplicationError("notice_list", 400, "CONTROLLER.NOTIFICATION.NOTIFICATION_LIST.EXCEPTION", { name: "EXCEPTION", error }));
  }
}
/* 
{
    "filter":{
        "$and": [{"notify.enabled": true},{"notify.event": "FlightReservation"},{"notify.notifyWhen": "CHANGED"}]
    },
    "select":  "member.email notify",
    "find_select": {
    }
}
*/
exports.notification_search = function (req, res, next) {
  try {
    log.info('notice_list/req', req.body);
    const filter = req.body.filter === undefined ? {} :  req.body.filter; 
    const select = req.body.select === undefined ? {} :  req.body.select; 
    const aggregate = Notification.aggregate();

     aggregate.unwind('$notify').match(filter).project(select)
      .exec(function (err, list_notification) {
        if (err) {
          log.debug(err);
          return next(err);
        }
        else {
          log.info('notice_list/results', list_notification.length);
          res.status(201).json({ success: true, errors: [], data: list_notification });
          return;
        }
      });
  }
  catch (error) {
    return next(new ApplicationError("notice_list", 400, "CONTROLLER.NOTIFICATION.NOTIFICATION_LIST.EXCEPTION", { name: "EXCEPTION", error }));
  }
}
exports.notification = [
  param('notify.name').trim().isLength({ min: 0 }).escape().withMessage('Name must be include'),
  async (req, res, next) => {
    try {
      const filterParams = req.body;
      log.info("notification/req.body", req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("notification", 400, "CONTROLLER.NOTIFICATION.NOTIFICATION.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const notifies = await Notification.find({notify: {name: filterParams.name }}).exec();
      if (notifies === null || notifies === undefined) {
        return res.status(400).json({ success: false, errors: ["notifies Not Exist"], data: [] })
      }
      return res.status(201).json({ success: true, errors: [], data: notifies })
    }
    catch (error) {
      return next(new ApplicationError("notice", 400, "CONTROLLER.NOTIFUCATION.NOTIFICATION.EXCEPTION", { name: "EXCEPTION", error }));
    }

  }
]
exports.notification_update = [

  async (req, res, next) => {
    try {
      log.info("notification_create", req.body);
      const notification = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("notification_create", 400, "CONTROLLER.CLUB_NOTICE.CREATE.VALIDATION", { name: "ExpressValidator", errors }));
      }
     
      Notification.findByIdAndUpdate({_id: notification._id}, notification, (err, result) => {
        if (err) {
          return res.status(400).json({ success: false, errors: [err], message: "Failed To Save", data: newNotification })
        }
        if (result) {
          log.info("notification_create/save/Result", result);
          return res.status(201).json({ success: true, errors: [], data: result })
        }
      })
    }
    catch (error) {
      return next(new ApplicationError("notification_create", 400, "CONTROLLER.NOTIFICATION.NOTIFICATION_CREATE.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]

exports.notification_create = [

  async (req, res, next) => {
    try {
      log.info("notification_create", req.body);
      const notify = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("notification_create", 400, "CONTROLLER.CLUB_NOTICE.CREATE.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const newNotification = new Notification({
        member: {
          _id: notify.member._id,
          fullName: notify.member.fullName,
          email: notify.member.email,
          phone: notify.member.phone,
        },
        enabled: notify.enabled,
        notify: notify.notify
      })
      newNotification.save((err, result) => {
        if (err) {
          return res.status(400).json({ success: false, errors: [err], message: "Failed To Save", data: newNotification })
        }
        if (result) {
          log.info("notification_create/save/Result", result);
          return res.status(201).json({ success: true, errors: [], data: newNotification })
        }
      })
    }
    catch (error) {
      return next(new ApplicationError("notification_create", 400, "CONTROLLER.NOTIFICATION.NOTIFICATION_CREATE.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]

exports.notice_update = [
  body("_id").isLength({ min: 24, max: 24 }).withMessage("_id must be 24 characters"),
  body('title').trim().isLength({ min: 1 }).withMessage("title must be with length > 0"),
  body('description').trim().isLength({ min: 1 }).withMessage("title must be with length > 0"),
  body('issue_date', 'Invalid issue_date').isISO8601(),
  body('due_date', 'Invalid issue_date').isISO8601(),
  async (req, res, next) => {
    try {
      log.info("notice_update", req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("Status update", 400, "CONTROLLER.CLUB_NOTICE.UPDATE.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const notice = await ClubNotice.findByIdAndUpdate(req.body._id, req.body).exec();
      if (notice) {
        return res.status(201).json({ success: true, errors: [], data: notice })
      }
      return res.status(400).json({ success: false, errors: ["Notice update failed"], data: [] })
    }
    catch (error) {
      return next(new ApplicationError("notice_update", 400, "CONTROLLER.NOTICE.NOTICE_UPDATE.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]

exports.notice_delete = [

  body('_id').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id_device must be valid 24 characters'),
  async (req, res, next) => {
    try {
      log.info("notice_delete/req", req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("Status update", 400, "CONTROLLER.CLUB_NOTICE.DELETE.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const notice = await ClubNotice.findByIdAndDelete(req.body._id).exec();
      if (notice === null || notice === undefined) {
        return res.status(400).json({ success: false, errors: ["Notice Not Exist"], data: [] })
      }
      return res.status(201).json({ success: true, errors: [], data: notice })
    }
    catch (error) {
      return next(new ApplicationError("notice_delete", 400, "CONTROLLER.NOTICE.NOTICE_DELETE.EXCEPTION", { name: "EXCEPTION", error }));
    }

  }
]


