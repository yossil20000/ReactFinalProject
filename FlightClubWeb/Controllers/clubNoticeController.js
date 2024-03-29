const log = require('debug-level').log('ClubNoticeController');
const { body, param, validationResult } = require('express-validator');
const { ApplicationError } = require('../middleware/baseErrors');
const { CValidationError } = require('../Utils/CValidationError');
const ClubNotice = require('../Models/clubNotice');
const { sendNotification } = require('../Services/notificationService');
const constants = require('../Models/constants')
exports.notice_list = function (req, res, next) {
    try {
        log.info('notice_list/req', req.body);
        ClubNotice.find()
            .sort([['issue_date', 'ascending']])
            .exec(function (err, list_notices) {
                if (err) {
                    log.debug(err);
                    return next(err); 
                }
                else {
                    log.info('notice_list/results',list_notices.length );
                    res.status(201).json({ success: true, errors: [], data: list_notices });
                    return;
                }
            });
    }
    catch (error) {
        return next(new ApplicationError("notice_list",400,"CONTROLLER.NOTICE.NOTICE_LIST.EXCEPTION",{name: "EXCEPTION", error}));
    }
}
exports.notice = [
    param('_id').trim().isLength({ min: 24, max:24 }).escape().withMessage('_id_device must be valid 24 characters'),
    async (req, res, next) => {
        try {
            log.info("club_notice/req", req.params);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ApplicationError("notice",400,"CONTROLLER.CLUB_NOTICE.NOTICE.VALIDATION",{name: "ExpressValidator", errors}));
            }
            const notice = await ClubNotice.findById(req.params._id).exec();
            if (notice === null || notice === undefined) {
                return next(new ApplicationError("notice", 400, "CONTROLLER.CLUB_NOTICE.NOTICE.VALIDATION", { name: "Validator", errors: (new CValidationError(req.params._id, `Account update failed`, '_id', "DB.Account")).validationResult.errors }));
            }
            return res.status(201).json({ success: true, errors: [], data: notice })
        }
        catch (error) {
            return next(new ApplicationError("notice",400,"CONTROLLER.NOTICE.NOTICE.EXCEPTION",{name: "EXCEPTION", error}));
        }

    }
]

exports.notice_create = [
    body('title').trim().isLength({ min: 1 }).withMessage("title must be with length > 0"),
    body('description').trim().isLength({ min: 1 }).withMessage("title must be with length > 0"),
    body('issue_date', 'Invalid issue_date').isISO8601(),
    body('due_date', 'Invalid issue_date').isISO8601(),
    async (req, res, next) => {
        try {
            log.info("notice_create", req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ApplicationError("notice_create",400,"CONTROLLER.CLUB_NOTICE.CREATE.VALIDATION",{name: "ExpressValidator", errors}));
            }
            const notice = new ClubNotice({
                title: req.body.title,
                description: req.body.description,
                issue_date: req.body.issue_date,
                due_date: req.body.due_date
            })
            notice.save((err, result) => {
                if (err) {
                    return next(new ApplicationError("notice", 400, "CONTROLLER.CLUB_NOTICE.CREATE.VALIDATION", { name: "Validator", errors: (new CValidationError('', `Notice save failed`, '', "DB.Account")).validationResult.errors }));
                }
                if (result) {
                    sendNotification(constants.NotifyEvent.ClubNotice,constants.NotifyOn.CREATED, notice.notification)
                    log.info("notice_create/save/Result", result);
                    return res.status(201).json({ success: true, errors: [], data: notice })
                }
            })
        }
        catch (error) {
            return next(new ApplicationError("notice_create",400,"CONTROLLER.NOTICE.NOTICE_CREATE.EXCEPTION",{name: "EXCEPTION", error}));
        }
    }
]

exports.notice_update = [
    body("_id").isLength({ min: 24, max:24 }).withMessage("_id must be 24 characters"),
    body('title').trim().isLength({ min: 1 }).withMessage("title must be with length > 0"),
    body('description').trim().isLength({ min: 1 }).withMessage("title must be with length > 0"),
    body('issue_date', 'Invalid issue_date').isISO8601(),
    body('due_date', 'Invalid issue_date').isISO8601(),
    async (req, res, next) => {
        try {
            log.info("notice_update", req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ApplicationError("Status update",400,"CONTROLLER.CLUB_NOTICE.UPDATE.VALIDATION",{name: "ExpressValidator", errors}));
            }
            const notice = await ClubNotice.findByIdAndUpdate(req.body._id, req.body).exec();
            if (notice) {
                sendNotification(constants.NotifyEvent.ClubNotice,constants.NotifyOn.CHANGED, notice.notification)
                return res.status(201).json({ success: true, errors: [], data: notice })
            }
            return next(new ApplicationError("notice", 400, "CONTROLLER.CLUB_NOTICE.UPDATE.VALIDATION", { name: "Validator", errors: (new CValidationError(req.body._id, `Notice update failed`, '_id', "DB.Account")).validationResult.errors }));
        }
        catch (error) {
            return next(new ApplicationError("notice_update",400,"CONTROLLER.NOTICE.NOTICE_UPDATE.EXCEPTION",{name: "EXCEPTION", error}));
        }
    }
]

exports.notice_delete = [
    
    body('_id').trim().isLength({ min: 24, max:24 }).escape().withMessage('_id_device must be valid 24 characters'),
    async (req, res, next) => {
        try {
            log.info("notice_delete/req", req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ApplicationError("Status update",400,"CONTROLLER.CLUB_NOTICE.DELETE.VALIDATION",{name: "ExpressValidator", errors}));
            }
            const notice = await ClubNotice.findByIdAndDelete(req.body._id).exec();
            if (notice === null || notice === undefined) {
                return next(new ApplicationError("notice", 400, "CONTROLLER.CLUB_NOTICE.DELETE.VALIDATION", { name: "Validator", errors: (new CValidationError(req.body._id, `Notice delete failed`, '_id', "DB.Account")).validationResult.errors }));
            }
            sendNotification(constants.NotifyEvent.ClubNotice,constants.NotifyOn.DELETED, notice.notification)
            return res.status(201).json({ success: true, errors: [], data: notice })
        }
        catch (error) {
            return next(new ApplicationError("notice_delete",400,"CONTROLLER.NOTICE.NOTICE_DELETE.EXCEPTION",{name: "EXCEPTION", error}));
        }

    }
]


