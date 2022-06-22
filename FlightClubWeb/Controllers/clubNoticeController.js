const log = require('debug-level').log('ClubNoticeController');
const async = require('async');
const { body, validationResult } = require('express-validator');

const ClubNotice = require('../Models/clubNotice');

exports.club_notice_list = function (req, res, next) {
    log.info('club_notice_list');
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

