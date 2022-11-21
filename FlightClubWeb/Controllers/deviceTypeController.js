const DeviceType = require("../Models/deviceType");
const Device = require('../Models/device');
const async = require('async');
const log = require('debug-level').log('deviceTypeController');

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

exports.deviceType_delete = function (req, res, next) {
    log.info('deviceType_delete');
    Device.find({ device_type: req.params._id }).exec((err, results) => {
        if (err) { return next(err); }
        else if (results === null) {
            res.status(400).json({ success: false, errors: ["Remove Device before Delete"], data: results });
            return;
        }
        DeviceType.findByIdAndDelete(req.params._id).exec((err, results) => {
            if (err) { return next(err); }
            res.status(201).json({ success: true, errors: [], data: results });
            return;
        });

    });
};

exports.deviceType_update = [
    body('_id').trim().isLength({ min: 1 }).escape().withMessage('_id must be specified'),
    body('name').trim().isLength({ min: 1 }).escape().withMessage('name must be specified'),
    body('category').trim().isIn(["Airplane", "Rotorcraft", "FDT"]).withMessage('Must one of: ["Airplane","Rotorcraft","FDT"]'),
    body('class.engien').trim().isIn(["SingleEngien", "Multiengien"]).withMessage('Must be one of: ["SingleEngien","Multiengien"] '),
    body('class.surface').trim().isIn(["Land", "Sea"]).withMessage('Must be one of : ["Land","Sea"]'),
    (req, res, next) => {
        log.info(req.body);
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, validation: errors, data: req.body });
            return;
        }
        else {
            DeviceType.findById(req.body._id, (err, results) => {
                if (err  ) {
                    res.status(400).json({ success: false, errors:[err], data: [] });
                    return;
                }
                if(!results){
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
];

exports.deviceType_create = [
    body('name').trim().isLength({ min: 1 }).escape().withMessage('name must be specified'),
    body('category').trim().isIn(["Airplane", "Rotorcraft", "FDT"]).withMessage('Must one of: ["Airplane","Rotorcraft","FDT"]'),
    body('class.engien').trim().isIn(["SingleEngien", "Multiengien"]).withMessage('Must be one of: ["SingleEngien","Multiengien"] '),
    body('class.surface').trim().isIn(["Land", "Sea"]).withMessage('Must be one of : ["Land","Sea"]'),
    (req, res, next) => {
        log.info(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, validation: errors, data: req.body });
            return;
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
                res.status(400).json({ success: true, errors:[err], data: result });
                return;
            });
        }
    }
];