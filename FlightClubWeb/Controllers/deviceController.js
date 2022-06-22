const log = require('debug-level').log('DeviceController');
const async = require('async');
const { body, validationResult } = require('express-validator');

const Device = require('../Models/device');
const DeviceType = require('../Models/deviceType');
const FlightReservation = require('../Models/flightReservation');

exports.device_list = function (req, res, next) {
    log.info('device_list');
    Device.find()
        .sort([['device_id', 'ascending']])
        .exec(function (err, list_devices) {
            if (err) { return next(err); log.debug(err); }
            else {
                res.status(201).json({ success: true, errors: [], data: list_devices });
                return;
            }
        });
}

exports.device_detail = function (req, res, next) {

};
exports.device_reservation = function (req, res, next) {
    try {
        log.info("device_reservation");
        Device.find({ _id: req.params._id, flights: { $exists: true, $not: { $size: 0 } } })
            .select('flights')
            .exec(function (err, list_members) {
                if (err) {
                    log.error(err);
                    res.status(401).json({ success: false,errors: [err], data: [] });
                    return ;
                }
                log.info(list_members);
                if (list_members.length == 0) {
                    res.status(202).json({ success: true, errors: [],data: [] });
                    return;
                }
                let data = list_members[0].flights;
                console.log(data);
                FlightReservation.find().where('_id').in(data).populate('member').exec((err, records) => {
                    log.info(records);
                    if (err) {
                        res.status(401).json({ success: false, errors:[err], data: records });
                        return
                    }
                    else {
                        res.status(202).json({ success: true,errors:[], data: records });
                        return
                    }
                });
            })
    }
    catch (err) {
        log.fatal(err);
        return next(err);
    }
}