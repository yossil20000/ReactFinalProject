const DeviceType = require("../Models/deviceType");
const Device = require('../Models/device');
const async = require('async');
const log = require('debug-level').log('deviceTypeController');
const { ApplicationError } = require('../middleware/baseErrors');
var { body, validationResult } = require('express-validator');

exports.deviceType_list = function (req, res, next) {
    log.info('deviceType_list');
    DeviceType.find()
        .sort({ class: -1, name: 1 })
        .exec((err, results) => {
            if (err) { return next(err); }
            else {
                res.status(201).json({ success: true, errors: [], data: results });
            }
        });
}
exports.deviceType_detail = function (req, res, next) {
    log.info('deviceType_detail');
    DeviceType.findById(req.params._id).exec((err, results) => {
        if (err) { return next(err); }
        else {
            res.status(201).json({ success: true, errors: [], data: results });
        }
    });
}

exports.deviceType_delete = [
    body('_id').trim().isLength(24).escape().withMessage('_id_device must be valid 24 characters'),
    body('passcode').equals('force_delete').withMessage("Invalid passcode"),
    function (req, res, next) {
        try {
            log.info('deviceType_delete', req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ApplicationError("deviceType_delete", "400", "CONTROLLER.DEVICE_TYPE.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
            }
            Device.find({ device_type: req.body._id }).exec((err, results) => {
                if (err) { return next(err); }
                else if (results === null) {
                    res.status(400).json({ success: false, errors: ["Remove Device before Delete"], data: results });
                    return;
                }
                DeviceType.findByIdAndDelete(req.body._id).exec((err, results) => {
                    if (err) { return next(err); }
                    res.status(201).json({ success: true, errors: [], data: results });
                    return;
                });

            });
        }
        catch(error){
            return next(new ApplicationError("deviceType_delete", "400", "CONTROLLER.DEVICE_TYPE.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
        }
    }];

exports.deviceType_status = [
    body('_id').trim().isLength(24).escape().withMessage('_id must be valid 24 characters'),
    body('status').trim().isLength({ min: 4 }).escape().withMessage('status must be valid 24 characters'),
    function (req, res, next) {
        log.info(`deviceType_status`, req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ApplicationError("deviceType_status", "400", "CONTROLLER.DEVICE_TYPE.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
        }
        try {
            async.parallel({
                deviceType: function (callback) {
                    DeviceType.updateOne({}, req.body, { runValidators: true }).exec(callback);
                }

            }, function (err, results) {
                if (err) { return next(err); }
                if (results.deviceType.acknowledged) {

                    if (results.deviceType.acknowledged == false) {
                        return res.status(400).json({ success: false, errors: [err], data: [] });
                    }
                    else {
                        return res.status(201).json({ success: true, errors: [], data: results });
                    }

                }
            });
        }
        catch (error) {
            return next(new ApplicationError("deviceType_status", "400", "CONTROLLER.DEVICE_TYPE.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
        }

    }]
exports.deviceType_update = [
    body('_id').trim().isLength(24).escape().withMessage('_id_device must be valid 24 characters'),
    body('name').trim().isLength({ min: 1 }).escape().withMessage('name must be specified'),
    body('category').trim().isIn(["Airplane", "Rotorcraft", "FDT"]).withMessage('Must one of: ["Airplane","Rotorcraft","FDT"]'),
    body('class.engien').trim().isIn(["SingleEngien", "Multiengien"]).withMessage('Must be one of: ["SingleEngien","Multiengien"] '),
    body('class.surface').trim().isIn(["Land", "Sea"]).withMessage('Must be one of : ["Land","Sea"]'),
    (req, res, next) => {
        try{
        log.info(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ApplicationError("deviceType_update", "400", "CONTROLLER.DEVICE_TYPE.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
        }
        else {
            DeviceType.findById(req.body._id, (err, results) => {
                if (err) {
                    res.status(400).json({ success: false, errors: [err], data: [] });
                    return;
                }
                if (!results) {
                    res.status(400).json({ success: false, errors: [`Can find _id`], data: [] });
                    return;
                }
                results.name = req.body.name;
                results.category = req.body.category;
                results.class.engien = req.body.class.engien;
                results.class.surface = req.body.class.surface;
                results.description = req.body.description === undefined ? results.description : req.body.description;
                results.save();
                res.status(201).json({ success: true, errors: [], data: results });
                return;
            });

        }
        //res.status(201).json({success: true, errors : [], data: req.body});
        return;
    }
    catch(error){
        return next(new ApplicationError("deviceType_update", "400", "CONTROLLER.DEVICE_TYPE.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
    }
    }
];

exports.deviceType_create = [
    body('name').trim().isLength({ min: 1 }).escape().withMessage('name must be specified'),
    body('category').trim().isIn(["Airplane", "Rotorcraft", "FDT"]).withMessage('Must one of: ["Airplane","Rotorcraft","FDT"]'),
    body('class.engien').trim().isIn(["SingleEngien", "Multiengien"]).withMessage('Must be one of: ["SingleEngien","Multiengien"] '),
    body('class.surface').trim().isIn(["Land", "Sea"]).withMessage('Must be one of : ["Land","Sea"]'),
    (req, res, next) => {
        try{
        log.info(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ApplicationError("deviceType_create", "400", "CONTROLLER.DEVICE_TYPE.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
        }
        else {
            let newDeviceType = new DeviceType({
                name: req.body.name,
                category: req.body.category,
                class: {
                    engien: req.body.class.engien,
                    surface: req.body.class.surface
                },
                description: req.body.description
            })
            newDeviceType.save((err, result) => {
                if (err) { return next(err); }
                res.status(400).json({ success: true, errors: [err], data: result });
                return;
            });
        }
    }
    catch(error){
        return next(new ApplicationError("deviceType_create", "400", "CONTROLLER.DEVICE_TYPE.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
    }
}
];