const log = require('debug-level').log('DeviceController');
const async = require('async');
const { body, param, validationResult } = require('express-validator');

const Device = require('../Models/device');
const Flight = require('../Models/flight');
const DeviceType = require('../Models/deviceType');
const { ApplicationError } = require('../middleware/baseErrors');
const { query } = require('express');

exports.device_list = function (req, res, next) {
    try {
        log.info('device_list', req.body.filter);
        Device.find(req.body.filter === undefined ? {} : req.body.filter, req.body.find_select === undefined ? {} : req.body.find_select)
            .populate("device_type maintanance.services")
            .select(req.body.select === undefined ? "" : req.body.select)
            .sort([['device_id', 'ascending']])
            .exec(function (err, list_devices) {
                if (err) { return next(err); }
                else {
                    res.status(201).json({ success: true, errors: [], data: list_devices });
                    return;
                }
            });
    }
    catch (error) {
        return next(new ApplicationError("device_list", 400, "CONTROLLER.DEVICE.DEVICE_LIST.EXCEPTION", { name: "EXCEPTION", error }));
    }
}

exports.device_combo = function (req, res, next) {
    try {
        log.info("combo", req.body);
        Device.find(req.body.filter === undefined ? {} : req.body.filter, req.body.find_select === undefined ? {} : req.body.find_select)
            .populate("device_type")
            .select('_id device_id engien_meter maintanance has_hobbs available')
            .sort([['device_id', 'ascending']])
            .exec(function (err, list_combo) {
                if (err) { return next(err); }
                res.status(201).json({ success: true, errors: [], data: list_combo });
            })
    }
    catch (error) {
        return next(new ApplicationError("combo", 400, "CONTROLLER.DEVICE.DEVICE_COMBO.EXCEPTION", { name: "EXCEPTION", error }));
    }
}
exports.can_reserv = [
    param('_id').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id'),
    function (req, res, next) {
        try {
            log.info("combo", req.params);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ApplicationError("status", 400, "CONTROLLER.DEVICE.STATUS.VALIDATION", { name: "ExpressValidator", errors }))
            }
            Device.find({ _id: req.params._id })
                .populate("can_reservs")
                .select('can_reservs')
                .exec(function (err, list_combo) {
                    if (err) { return next(err); }
                    res.status(201).json({ success: true, errors: [], data: list_combo });
                })
        }
        catch (error) {
            return next(new ApplicationError("combo", 400, "CONTROLLER.DEVICE.DEVICE_COMBO.EXCEPTION", { name: "EXCEPTION", error }));
        }
    }]

exports.device = function (req, res, next) {
    try {
        Device.findById(req.params._id)
            .populate("device_type")
            .exec(function (err, device) {
                if (err) { log.debug(err); return next(err); }
                else {
                    res.status(201).json({ success: true, errors: [], data: device });
                    return;
                }
            });
    }
    catch (error) {
        return next(new ApplicationError("device", 400, "CONTROLLER.DEVICE.DEVICE.EXCEPTION", { name: "EXCEPTION", error }));
    }

};
exports.device_reservation = function (req, res, next) {
    try {
        log.info("device_reservation");
        Device.find({ _id: req.params._id, flight_reservs: { $exists: true, $not: { $size: 0 } } })
            .select('flight_reservs')
            .populate('flight_reservs')
            .exec(function (err, results) {
                if (err) {
                    log.error(err);
                    res.status(400).json({ success: false, errors: [err], data: [] });
                    return;
                }
                log.info(results);
                if (results.length == 0) {
                    res.status(202).json({ success: true, errors: [], data: [] });
                    return;
                }
                let data = results[0].flight_reservs;
                log.info(data);
                res.status(201).json({ success: true, errors: [], data: data });
                return;
            })
    }
    catch (error) {
        return next(new ApplicationError("device_reservation", 400, "CONTROLLER.DEVICE.DEVICE_RESERV.EXCEPTION", { name: "EXCEPTION", error }));
    }
}
exports.device_flights = [
    async (req, res, next) => {
        try {
            log.info("device_flights");
            Device.find({ _id: req.params._id, flights: { $exists: true, $not: { $size: 0 } } })
                .select('flights')
                .populate('flights')
                .exec(function (err, results) {
                    if (err) {
                        log.error(err);
                        res.status(400).json({ success: false, errors: [err], data: [] });
                        return;
                    }
                    log.info(results);
                    res.status(202).json({ success: true, errors: [], data: results[0].flights });
                    return;
                })
        }
        catch (error) {
            return next(new ApplicationError("device_flights", 400, "CONTROLLER.DEVICE.DEVICE_FLIGHT.EXCEPTION", { name: "EXCEPTION", error }));
        }
    }
]

exports.device_report = [
    param('device_id', "lenght > 3 and only [0-9] [A-Z]").custom((value, { req }) => {
        return /^[A-Z0-9]{4,}$/.test(value)
    }),
    async (req, res, next) => {
        try {
            log.info("device_report");
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ApplicationError("device_report", 400, "CONTROLLER.DEVICE.device_report.VALIDATION", { name: "ExpressValidator", errors }));
            }
            /* 
            let device_flight = await Device.find({ device_id: req.params.device_id, flights: { $exists: true, $not: { $size: 0 } } })
                .select('flights engien_meter')
                .populate('flights').exec();
                let find = await Flight.find({path: 'device',device_id: "4XCGC"}).populate('device').exec();
             */    
               let query = Flight.find({path: 'device',device_id: "4XCGC"}).sort({engien_stop: -1}).limit(1)
               /* .populate({path: 'device', select: '-can_reservs -flights -flight_reservs -details.image'}) */
               .populate({path: 'device', select: 'maintanance available device_status engien_meter status device_id due_date'})
               /* .populate({path:"member", select: '-password -flights -flight_reservs -image'}) */
               .populate({path: 'member', select: 'member_id family_name first_name'})
               .exec(function (err, results) {
                    if (err) {
                        log.error(err);
                        res.status(400).json({ success: false, errors: [err.message,err.stack], data: [] });
                        return;
                    }
                    log.info(results);
                    res.status(202).json({ success: true, errors: [], data: results });
                    return;
                })
        }
        catch (error) {
            return next(new ApplicationError("device_flights", 400, "CONTROLLER.DEVICE.DEVICE_FLIGHT.EXCEPTION", { name: "EXCEPTION", error }));
        }
    }
]

exports.create = [
    body('device_type').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id_device_type must be valid'),
    body('device_id', "lenght > 3 and only [0-9] [A-Z]").custom((value, { req }) => {
        return /^[A-Z0-9]{4,}$/.test(value)
    }),
    async function (req, res, next) {
        let newDevice1;
        try {
            newDevice1 = req.body;
            newDevice1._id = null

            log.info("device/create/body", req.body, newDevice1);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ApplicationError("create", 400, "CONTROLLER.DEVICE.CREATE.VALIDATION", { name: "ExpressValidator", errors }));
            }
            const device_type = await DeviceType.findById(req.body.device_type).exec();
            if (device_type == null) {
                res.status(400).json({ success: false, errors: ["DeviceType Not Exist"], data: [] });
                return;
            }
            const isExsit = await Device.findOne({ device_id: req.body.device_id }).exec();
            if (isExsit) {
                res.status(400).json({ success: false, errors: ["device_id already Exist"], data: [] });
                return;
            }
            let newDevice = new Device(newDevice1);

            log.info("device/create/newDevice", newDevice);
            newDevice.save((error, result) => {
                if (error) {
                    let appError = new ApplicationError("DeviceCreate", 400, "CONTROLLER.DEVICE.CREATE.DB", error);

                    return next(appError);

                }
                if (result) {
                    log.info("notice_create/save/Result", result);
                    return res.status(201).json({ success: true, errors: [], data: result })
                }
            })

        }
        catch (error) {
            return next(new ApplicationError("create", 400, "CONTROLLER.DEVICE.CREATE.EXCEPTION", { name: "EXCEPTION", error }));
        }
    }

]

exports.update = [
    body('_id').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id'),
    body('device_type._id').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id_device_type must be valid'),
    body('device_id', "lenght > 3 and only [0-9] [A-Z]").custom((value, { req }) => {
        return /^[A-Z0-9]{4,}$/.test(value)
    }),
    async function (req, res, next) {
        try {
            log.info("device/update/body", req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ApplicationError("update", 400, "CONTROLLER.DEVICE.UPDATE.VALIDATION", { name: "ExpressValidator", errors }))
            }
            const device_type = await DeviceType.findById(req.body.device_type).exec();
            if (device_type == null) {
                res.status(400).json({ success: false, errors: ["DeviceType Not Exist"], data: [] });
                return;
            }

            const _id = req.body._id;

            let newDevice = new Device(req.body);

            log.info("device/update/newDevice", newDevice);
            Device.updateOne({ _id: _id }, req.body, (err, result) => {
                if (err) {
                    return res.status(400).json({ success: false, errors: [err.message], message: "Failed To Save", data: newDevice })
                }
                if (result) {
                    log.info("device/update/Result", result);
                    return res.status(201).json({ success: true, errors: [], data: result })
                }
            })

        }
        catch (error) {
            return next(new ApplicationError("update", 400, "CONTROLLER.DEVICE.UPDATE.EXCEPTION", { name: "EXCEPTION", error }));
        }
    }

]

exports.updateOne = [
    body('_id').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id'),
    async function (req, res, next) {
        try {
            log.info("device/update/body", req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ApplicationError("update", 400, "CONTROLLER.DEVICE.UPDATE.VALIDATION", { name: "ExpressValidator", errors }))
            }

            const _id = req.body._id;

            Device.updateOne({ _id: _id }, req.body.update, (err, result) => {
                if (err) {
                    return res.status(400).json({ success: false, errors: [err.message], message: "Failed To Save", data: req.body.update })
                }
                if (result) {
                    log.info("device/update/Result", result);
                    return res.status(201).json({ success: true, errors: [], data: result })
                }
            })

        }
        catch (error) {
            return next(new ApplicationError("update", 400, "CONTROLLER.DEVICE.UPDATE.EXCEPTION", { name: "EXCEPTION", error }));
        }
    }

]
exports.delete = [
    param('_id').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id'),
    body('passcode').equals('force_delete').withMessage("Invalid passcode"),
    async function (req, res, next) {
        try {
            log.info("device/delete/params", req.params);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ApplicationError("delete", 400, "CONTROLLER.DEVICE.DELETE.VALIDATION", { name: "ExpressValidator", errors }));
            }
            Device.deleteOne({ _id: req.params._id }, (err, result) => {
                if (err) {
                    return res.status(400).json({ success: false, errors: [err.message], message: "Failed To Delete", data: [] })
                }
                if (result) {
                    log.info("device/delete/Result", result);
                    return res.status(201).json({ success: true, errors: [], data: result })
                }
            })

        }
        catch (error) {
            return next(new ApplicationError("delete", 400, "CONTROLLER.DEVICE.DELETE.EXCEPTION", { name: "EXCEPTION", error }));
        }
    }

]

exports.status = [
    body('_id').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id must be valid 24 characters'),
    body('status').trim().isLength({ min: 4 }).escape().withMessage('memberId must be valid 24 characters'),
    function (req, res, next) {
        log.info(`device_status`, req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ApplicationError("status", 400, "CONTROLLER.DEVICE.STATUS.VALIDATION", { name: "ExpressValidator", errors }))
        }
        try {

            async.parallel({
                device: function (callback) {
                    Device.updateOne({}, req.body, { runValidators: true }).exec(callback);
                }

            }, function (error, results) {
                if (error) {

                    let appError = new ApplicationError("Status update", 400, "CONTROLLER.DEVICE.STATUS.DB", error);

                    return next(appError);
                    //return  res.status(400).json({ success: false, dbEerror: error, data: [] }) 
                }
                if (results.device) {

                    if (results.device.acknowledged == false) {
                        return next(new ApplicationError("Status update", 400, "CONTROLLER.DEVICE.STATUS.DB", { name: "Acknowledged", message: `matchedCount: ${results.device.matchedCount}` }));
                    }
                    else {
                        return res.status(201).json({ success: true, data: [results] });
                    }

                }
            });
        }
        catch (error) {
            return next(new ApplicationError("Status update", 400, "CONTROLLER.DEVICE.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
        }

    }]

/// Filtetering via body
/* {
    "filter":{
        "device_id": "4XCGC"
    },
    "select": "",
    "find_select": {
        "maintanance": 1,
        "details":1
    }
} */
///