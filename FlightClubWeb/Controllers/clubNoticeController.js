const log = require('debug-level').log('ClubNoticeController');
const async = require('async');
const { body,param, validationResult } = require('express-validator');

const ClubNotice = require('../Models/clubNotice');

exports.notice_list = function (req, res, next) {
    log.info('notice_list/req', req.body);
    ClubNotice.find()
        .sort([['issue_date', 'ascending']])
        .exec(function (err, list_notices) {
            if (err) { return next(err); log.debug(err); }
            else {
                res.status(201).json({ success: true, errors: [], data: list_notices });
                return;
            }
        });
}
exports.notice = [
    param('_id').trim().isLength(24).escape().withMessage('_id_device must be valid 24 characters'),
    async (req, res, next) => {
        try {
            log.info("club_notice/req", req.params);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(401).json({ success: false, validation: errors, data: req.params });
            }
            const notice = await ClubNotice.findById(req.params._id).exec();
            if (notice === null || notice === undefined) {
                return res.status(401).json({ success: false, errors: ["Notice Not Exist"], data: [] })
            }
            return res.status(201).json({ success: true, errors: [], data: notice })
        }
        catch (error) {
            return res.status(501).json({ success: false, errors: [error.message], data: [] })
        }

    }
]

exports.notice_create = [
    body('title').trim().isLength({ min: 1 }).withMessage("title must be with length > 0"),
    body('description').trim().isLength({ min: 1 }).withMessage("title must be with length > 0"),
    body('issue_date', 'Invalid issue_date').trim().isISO8601().toDate(),
    body('due_date', 'Invalid issue_date').trim().isISO8601().toDate(),
    async (req, res, next) => {
        try {
            log.info("notice_create", req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(401).json({ success: false, validation: errors, data: req.body });
            }
            const notice = new ClubNotice({
                title: req.body.title,
                description: req.body.description,
                issue_date: req.body.issue_date,
                due_date: req.body.due_date
            })
            notice.save((err,result) => {
                if(err){
                    return res.status(401).json({ success: false, errors: [err], message: "Failed To Save", data: notice })
                }
                if(result){
                    log.info("notice_create/save/Result", result);
                    return res.status(201).json({ success: true, errors: [], data: notice })
                }
            })
        }
        catch (error) {
            return res.status(501).json({ success: false, errors: [error.message], data: [] })
        }
    }
]

exports.notice_update = [
    body("_id").isLength(24).withMessage("_id must be 24 characters"),
    body('title').trim().isLength({ min: 1 }).withMessage("title must be with length > 0"),
    body('description').trim().isLength({ min: 1 }).withMessage("title must be with length > 0"),
    body('issue_date', 'Invalid issue_date').trim().isISO8601().toDate(),
    body('due_date', 'Invalid issue_date').trim().isISO8601().toDate(),
    async (req,res,next) => {
        try{
            log.info("notice_update", req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(401).json({ success: false, validation: errors, data: req.body });
            }
            const notice = await ClubNotice.findByIdAndUpdate(req.body._id,req.body).exec();
            if(notice){
                return res.status(201).json({ success: true, errors: [], data: notice })
            }
            return res.status(401).json({ success: false, errors: ["Notice update failed"], data: [] })
        }
        catch(error){
            return res.status(501).json({ success: false, errors: [error.message], data: [] })
        }
    }
]

exports.notice_delete = [
    body('_id').trim().isLength(24).escape().withMessage('_id_device must be valid 24 characters'),
    async (req, res, next) => {
        try {
            log.info("notice_delete/req", req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(401).json({ success: false, validation: errors, data: req.body });
            }
            const notice = await ClubNotice.findByIdAndDelete(req.body._id).exec();
            if (notice === null || notice === undefined) {
                return res.status(401).json({ success: false, errors: ["Notice Not Exist"], data: [] })
            }
            return res.status(201).json({ success: true, errors: [], data: notice })
        }
        catch (error) {
            return res.status(501).json({ success: false, errors: [error.message], data: [] })
        }

    }
]


