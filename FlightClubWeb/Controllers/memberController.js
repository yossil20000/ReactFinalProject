const Member = require('../Models/member');
const FlightReservation = require('../Models/flightReservation');


const async = require('async');
const log = require('debug-level').log('MemberController');
const mail = require("../Services/mailService");

var { body, validationResult } = require('express-validator');
const passGen = require('../Services/passwordGenerator');
const role = require('../Models/role');


exports.member_list = function (req, res, next) {
    log.info("member_list");
    Member.find()
        .select('-username -password')
        .sort([['family_name', 'ascending']])
        .exec(function (err, list_members) {
            if (err) { return next(err); }
            res.status(201).json({ success: true, errors: [], data: list_members });
        })
}
exports.member_detail = function (req, res, next) {
    log.info(`member_detail`);
    Member.findById(req.params.id).select('-username -password')
        .exec(function (err, member) {
            if (err) { return next(err); }
            res.status(201).json({ success: true, errors: [], data: member });
        });
}
exports.member_delete = function (req, res, next) {
    log.info(`member_delete`);
    
    async.parallel({
        member: function (callback) {
            Member.findById(req.params.memberId).exec(callback);
        },
        reservations_member: function (callback) {
            FlightReservation.find({ 'member': req.params.memberId }).exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        log.info(results.reservations_member);
        if (results.reservations_member == req.params.memberId) {
            res.status(401).json({ success: false, errors: ["member has link reservation"], data: results.reservations_member })
            return;
        }
        else {
            Member.findByIdAndRemove(req.params.memberId, function (err, doc) {
                if (err) { return next(err); }
                res.status(201).json({ success: true, errors: [], data: doc });
            });
        }
    });
}
exports.member_active = function (req, res, next) {
    log.info(`member_delete`);
    async.parallel({
        member: function (callback) {
            Member.findById(req.params.memberId).exec(callback);
        }

    }, function (err, results) {
        if (err) { return next(err); }
        if (results) {
            results.status = "Suspended";
            results.save(function (err) {
                if (err) {
                    res.status(401).json({ success: false, errors: [err], data: [] });
                }
                else {
                    res.status(201).json({ success: true, errors: [], data: results });
                }
            })
        }
    });
}
exports.member_update = [
    body('_id').trim().isLength({ min: 1 }).escape().withMessage('_id must be specified'),
    body('member_id').trim().isLength({ min: 1 }).escape().withMessage('member_id must be specified'),
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('first_name must be specified '),
    body('family_name').trim().isLength({ min: 1 }).escape().withMessage('family_name must be specified'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_join', 'Invalid date_of_join').optional({ checkFalsy: true }).isISO8601().toDate(),
    (req, res, next) => {
        const errors = validationResult(req);
        log.info(req.body);
        if (!errors.isEmpty()) {
            res.status(401).json({ success: false, validation: errors, data: req.body });
        }
        else if (req.body.username || req.body.password) {
            res.status(401).json({ success: false, errors: ["username / password not allowed"], data: req.body });
        }
        else {
            async.parallel(
                {
                    member_update: function (callback) {
                        Member.findByIdAndUpdate(req.body._id, req.body, {}).exec(callback);
                    }
                }, function (err, results) {
                    if (err) { return next(err); }
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
];

exports.member_create = [
    body('member_id').trim().isLength({ min: 1 }).escape().withMessage('member_id must be specified'),
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('first_name must be specified '),
    body('family_name').trim().isLength({ min: 1 }).escape().withMessage('family_name must be specified'),
    body('contact.email').trim().isEmail().withMessage('email is invalid'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_join', 'Invalid date_of_join').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('username', `8-12 characters,  at list one digit lower & upper case. not include ( <>?$&*%()+- )`).custom((value) => {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[!@_])[^<>?$&*%()+-]{8,12}$/.test(value);
    }),
    body('password', `min 8 characters,  at list one digit lower & upper case. not include ( <>?$&*%()+- )`).custom((value) => {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[!@_])[^<>?$&*%()+-]{8,}$/.test(value);
    }),
    (req, res, next) => {
        log.info("member_create", req.body)
        const errors = validationResult(req);
        log.info(req.body);
        if (!errors.isEmpty()) {
            res.status(401).json({ success: false, validation: errors, data: req.body });
        }
        else {
            const user = req.body;
            Member.findOne({ "username": user.username }, (err, member) => {

                if (member) {
                    return res.status(401).json({ success: false, errors: ["username already registered"], message: "email already registered" });
                }
                else {
                    const member = new Member(
                        {
                            first_name: user.first_name,
                            family_name: user.family_name,
                            member_id: req.body.member_id,
                            date_of_birth: user.date_of_birth,
                            date_of_join: user.date_of_join === undefined ? new Date() : user.date_of_join,
                            password: user.password,
                            contact: user.contact,
                            username: user.username,
                            role: user.role,

                        });
                    console.log("membertosave", member);
                    member.save((err, result) => {
                        if (err) {
                            return res.status(401).json({ success: false, errors: [err], message: "Failed To Save", data: member })
                        }
                        if (result) {
                            console.log("membertosave/Result", result);
                            console.log("member.contact.email", member.contact.email)
                            mail.SendMail(user.contact.email, "Create New user", `Your temporary paassword is ${user.password} Please Login with your maile`)
                                .then((result) => {
                                    console.log("Send Mail to:", user.contact.email);
                                    res.status(201).json({ success: true, errors: [], message: "You Initial passwors was sent to your mail", data: member })
                                }).catch((err => {
                                    res.status(401).json({ success: false, errors: [err], message: "Failed To send Initial passwors to your mail", data: member })
                                }));
                        }

                    })
                }

            });
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
                console.log(data);
                FlightReservation.find().where('_id').in(data).exec((err, records) => {
                    log.info(records);
                    res.status(202).json({ success: true, errors: [], data: records });
                    return
                });

                /*             res.status(202).json({success: true, data: list_members});
                            return; */
            })
    }
    catch (err) {
        log.info(err);
        res.status(401).json({ success: false, errors: [err], data: [] });
    }

}
