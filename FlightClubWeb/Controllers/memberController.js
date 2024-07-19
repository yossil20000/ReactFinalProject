const Member = require('../Models/member');
const Flight = require('../Models/flight')
const FlightReservation = require('../Models/flightReservation');
const { ApplicationError } = require('../middleware/baseErrors');
const { CValidationError } = require('../Utils/CValidationError');
const async = require('async');
const log = require('debug-level').log('MemberController');
const mail = require("../Services/mailService");
require('../Types/date.extensions')

var { body, validationResult } = require('express-validator');
const { path } = require('../app');
const member = require('../Models/member');
const { getLastMemberId } = require('../Services/memberService');

exports.member_flight_summary = async function (req, res, next) {
    try {
        log.info("member_flight_summary");
        const filter = {
            from: req.body.from === undefined ? new Date().getStartOfYear() : new Date(req.body.from).getStartDayDate(),
            to: req.body.to === undefined ? new Date().getEndOfYear() : new Date(req.body.to).getEndDayDate(),
            status: req.body.status === undefined ? 'CLOSE' : req.body.status,
            member_type: "Member"
        }
        let result = await Flight.aggregate([
            {$match: {date : {'$gte': filter.from, '$lte' : filter.to },status: filter.status }}, 
            {$group: {_id: '$member',total: {$sum: {$add: ['$engien_stop' ,{$multiply: [-1, '$engien_start']}]}}}},
            {$project: {
                totalHours: {
                    $convert: {
                        input: '$total',
                        to:'string'
                    }
                }
            }}
        ]).exec();
        
        console.log(result)
        const members = await Member.find({member_type: filter.member_type})
            .select({'_id':1, 'member_id': 1 ,'id_number': 1, 'first_name': 1 , 'family_name': 1, 'flights_summary': 1})
            .sort([['family_name', 'ascending']])
            .exec();
            res.status(201).json({ success: true, errors: [], data: {member_flights_size: result.length,member_flight_filter:{from: filter.from,to: filter.to}, member_flights: result,annual_summary_flights_size:members.length, annual_summary_flights: members} });
    }
    catch (error) {
        return next(new ApplicationError("member_list", 400, "CONTROLLER.MEMBER.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
    }
}
exports.member_list = async function (req, res, next) {
    try {
        
        log.info("member_list");
        Member.find()
            .populate("membership")
            .select('-username -password')
            .sort([['family_name', 'ascending']])
            .exec(function (err, list_members) {
                if (err) { return next(err); }
                res.status(201).json({ success: true, errors: [], data: list_members });
            })
    }
    catch (error) {
        return next(new ApplicationError("member_list", 400, "CONTROLLER.MEMBER.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
    }
}

exports.member_lastId = async function (req, res, next) {
    try {
        
        log.info("member_list");
        const lastId = await getLastMemberId()
        res.status(201).json({ success: true, errors: [], data: {last_id: lastId} });
        
    }
    catch (error) {
        return next(new ApplicationError("member_lastId", 400, "CONTROLLER.MEMBER.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
    }
}
exports.combo = function (req, res, next) {
    try {
        log.info("combo/filter", req.body);
        Member.find(req?.body?.filter === undefined ? {} : req.body.filter, req.body.find_select === undefined ? {} : req.body.find_select)
            .select('family_name _id member_id first_name member_type id_number status')
            .sort([['family_name', 'ascending']])
            .exec(function (err, list_members) {
                if (err) { return next(err); }
                res.status(201).json({ success: true, errors: [], data: list_members });
            })
    }
    catch (error) {
        return next(new ApplicationError("combo", 400, "CONTROLLER.MEMBER.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
    }
}
exports.member_detail = function (req, res, next) {
    try {
        log.info(`member_detail`);
        Member.findById(req.params.id).select('-username -password')
            .exec(function (err, member) {
                if (err) { return next(err); }
                res.status(201).json({ success: true, errors: [], data: member });
            });
    }
    catch (error) {
        return next(new ApplicationError("member_detail", 400, "CONTROLLER.MEMBER.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
    }
}
exports.member_delete = [
    body('_id').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id must be valid 24 characters'),
    body('memberId').trim().isLength({ min: 24, max: 24 }).escape().withMessage('memberId must be valid 24 characters'),
    body('passcode').equals('force_delete').withMessage("Invalid passcode"),
    function (req, res, next) {
        log.info(`member_delete`, req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ApplicationError("member_delete", 400, "CONTROLLER.MEMBER.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
        }
        try {
            async.parallel({
                member: function (callback) {
                    Member.findById(req.body._id).exec(callback);
                },
                reservations_member: function (callback) {
                    FlightReservation.find({ 'member': req.body._id }).exec(callback);
                }
            }, function (err, results) {
                if (err) { return next(err); }
                log.info(results.reservations_member);
                if (results.reservations_member == req.body._id) {
                    res.status(400).json({ success: false, errors: ["member has link reservation"], data: results.reservations_member })
                    return;
                }
                else {
                    Member.findByIdAndRemove(req.body._id, function (err, doc) {
                        if (err) { return next(err); }
                        return res.status(201).json({ success: true, errors: [], data: doc });
                    });
                }
            });
        }
        catch (error) {
            return next(new ApplicationError("member_delete", 400, "CONTROLLER.MEMBER.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
        }

    }]
exports.member_status = [
    body('_id').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id must be valid 24 characters'),
    body('status').trim().isLength({ min: 4 }).escape().withMessage('memberId must be valid '),
    function (req, res, next) {
        log.info(`member_stats`, req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ApplicationError("member_status", 400, "CONTROLLER.MEMBER.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
        }
        try {
            async.parallel({
                member: function (callback) {
                    Member.updateOne({}, req.body, { runValidators: true }).exec(callback);
                }

            }, function (err, results) {
                if (err) { return res.status(400).json({ success: false, errors: [err], data: [] }); }
                if (results.member.acknowledged) {

                    if (results.member.acknowledged == false) {
                        return res.status(400).json({ success: false, errors: [err], data: [] });
                    }
                    else {
                        return res.status(201).json({ success: true, errors: [], data: results });
                    }

                }
            });
        }
        catch (error) {
            return next(new ApplicationError("member_status", 400, "CONTROLLER.MEMBER.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
        }
    }]
exports.member_update = [
    body('_id').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id_device must be valid 24 characters'),
    body('member_id').trim().isLength({ min: 1 }).escape().withMessage('member_id must be specified'),
    body('contact.email').isEmail().escape().withMessage('email must be specified'),
    body('contact.billing_address.line1').trim().isLength({ min: 1 }).escape(),
    body('contact.billing_address.city').trim().isLength({ min: 1 }).escape(),
    body('contact.billing_address.postcode').trim().isLength({ min: 1 }).escape(),
    body('contact.billing_address.province').trim().isLength({ min: 1 }).escape(),
    body('contact.billing_address.state').trim().isLength({ min: 1 }).escape(),
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('first_name must be specified '),
    body('family_name').trim().isLength({ min: 1 }).escape().withMessage('family_name must be specified'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_join', 'Invalid date_of_join').optional({ checkFalsy: true }).isISO8601().toDate(),
    (req, res, next) => {
        try {
            const errors = validationResult(req);
            log.info("member_update", req.body);
            if (!errors.isEmpty()) {
                return next(new ApplicationError("member_update", 400, "CONTROLLER.MEMBER.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
            }
            else if (req.body.username || req.body.password) {
                return res.status(400).json({ success: false, errors: ["username / password not allowed"], data: req.body });
            }
            else {
                async.parallel(
                    {
                        member_update: function (callback) {
                            Member.findByIdAndUpdate(req.body._id, req.body, {}).exec(callback);
                        }
                    }, function (err, results) {
                        if (err) { 
                            return next(err); }
                        else {
                            res.status(201).json({ success: true, errors: [], data: results.member_update });
                            return;
                        }
                    }
                );
                /* Member.findByIdAndUpdate(req.body,(err, doc) => {
                    if(err) {return next(err);}
                    res.status(201).json({success: true, errors : err, data: doc});
                }); */
            }
        }
        catch (error) {
            return next(new ApplicationError("member_update", 400, "CONTROLLER.MEMBER.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
        }
    }
];

exports.member_create = [
    body('member_id').trim().isLength({ min: 1 }).escape().withMessage('member_id must be specified'),
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('first_name must be specified '),
    body('family_name').trim().isLength({ min: 1 }).escape().withMessage('family_name must be specified'),
    body('contact.email').trim().isEmail().withMessage('email is invalid'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_join', 'Invalid date_of_join').optional({ checkFalsy: true }).isISO8601(),
    body('username', `min 8 characters,  at list one digit lower & upper case. not include ( <>?$&*%()+- )`).custom((value) => {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[!@_])[^<>?$&*%()+-]{8,}$/.test(value);
    }),
    body('password', `min 8 characters,  at list one digit lower & upper case. not include ( <>?$&*%()+- )`).custom((value) => {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[!@_])[^<>?$&*%()+-]{8,}$/.test(value);
    }),
    (req, res, next) => {
        try {
            log.info("member_create", req.body)
            const errors = validationResult(req);
            log.info(req.body);
            if (!errors.isEmpty()) {
                return next(new ApplicationError("member_create", 400, "CONTROLLER.MEMBER.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
            }
            else {
                const user = req.body;
                Member.findOne({ "username": user.username }, (err, member) => {

                    if (member) {
                        return next(new ApplicationError("account_create", 400, "CONTROLLER.MEMBER.CREATE.VALIDATION", { name: "Validator", errors: (new CValidationError(req.body.member_id, `member already exist`, 'member_id', "DB.Member")).validationResult.errors }));
                    }
                    else {
                        const member = new Member(
                            {
                                first_name: user.first_name,
                                family_name: user.family_name,
                                member_id: req.body.member_id,
                                id_number: (req.body.id_number === undefined || req.body.id_number === '') ? '0000000' : req.body.id_number ,
                                date_of_birth: user.date_of_birth === undefined ? new Date() : user.date_of_birth,
                                date_of_join: user.date_of_join === undefined ? new Date() : user.date_of_join,
                                password: user.password,
                                contact: user.contact,
                                username: user.username,
                                role: user.role,

                            });
                            log.info("membertosave", member);
                        member.save((err, result) => {
                            if (err) {
                                return next(new ApplicationError("account_create", 400, "CONTROLLER.MEMBER.CREATE.VALIDATION", { name: "Validator", errors: (new CValidationError(req.body.member_id, `Failed to save member`, 'member_id', "DB.Member")).validationResult.errors }));
                            }
                            if (result) {
                                log.info("membertosave/Result", result);
                                log.info("member.contact.email", member.contact.email)
                                mail.SendMail(process.env.SITE_MAIL, "Create New user", `Your paassword is ${user.password} Please Login with your email`)
                                    .then(() => {
                                        log.info("Send Mail to:", user.contact.email);
                                        res.status(201).json({ success: true, errors: [], message: "You Initial passwors was sent to your mail", data: member })
                                    }).catch((err => {
                                        return next(new ApplicationError("member_create", 400, "CONTROLLER.MEMBER.STATUS.EXCEPTION", { name: "EXCEPTION", err }));
                                    }));
                            }

                        })
                    }

                });
            }
        }
        catch (error) {
            return next(new ApplicationError("member_create", 400, "CONTROLLER.MEMBER.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
        }
    }

];
exports.members_flights_reserv = function (req, res, next) {

    try {
        log.info("members_flights_reserv");
        Member.find({ flights: { $exists: true, $not: { $size: 0 } } })
            .select('flights')
            .exec(function (err, list_members) {
                if (err) { return next(err); }
                if (list_members.length == 0) {
                    res.status(202).json({ success: true, errord: [], data: [] });
                    return;
                }
                log.info("list_members", list_members);

                let data = list_members[0].flights;
                log.info(data);
                FlightReservation.find().where('_id').in(data).exec((err, records) => {
                    log.info(records);
                    res.status(202).json({ success: true, errors: [], data: records });
                    return
                });
            })
    }
    catch (error) {
        return next(new ApplicationError("member_flight_reserv", 400, "CONTROLLER.MEMBER.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
    }

}
