const log = require('debug-level').log('DeviceController');
const async = require('async');
const { body,param, validationResult } = require('express-validator');

const Device = require('../Models/device');
const DeviceType = require('../Models/deviceType');
const FlightReservation = require('../Models/flightReservation');

exports.device_list = function (req, res, next) {
    log.info('device_list',req.body.filter);
    Device.find(req.body.filter === undefined ? {} : req.body.filter, req.body.find_select === undefined ? {} : req.body.find_select)
        .populate("device_type")
        .select(req.body.select === undefined ? "" : req.body.select)
        .sort([['device_id', 'ascending']])
        .exec(function (err, list_devices) {
            if (err) { return next(err); log.debug(err); }
            else {
                res.status(201).json({ success: true, errors: [], data: list_devices });
                return;
            }
        });
}
exports.combo = function (req, res, next) {
    log.info("combo");
    Device.find()
        .select('_id device_id engien_meter maintanance')
        .sort([['device_id', 'ascending']])
        .exec(function (err, list_combo) {
            if (err) { return next(err); }
            res.status(201).json({ success: true, errors: [], data: list_combo });
        })
}
exports.device = function (req, res, next) {
    try{
        Device.findById(req.params._id)
        .populate("device_type")
        .exec(function (err, device) {
            if (err) { log.debug(err); return next(err);  }
            else {
                res.status(201).json({ success: true, errors: [], data: device });
                return;
            }
        });
    }
    catch(err){

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
                    res.status(400).json({ success: false,errors: [err], data: [] });
                    return ;
                }
                log.info(results);
                if (results.length == 0) {
                    res.status(202).json({ success: true, errors: [],data: [] });
                    return;
                }
                let data = results[0].flight_reservs;
                console.log(data);
                res.status(201).json({ success: true, errors: [],data: data });
                    return;
                FlightReservation.find().where('_id').in(data).populate('member').exec((err, records) => {
                    log.info(records);
                    if (err) {
                        res.status(400).json({ success: false, errors:[err], data: records });
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
        res.status(501).json({ success: false, errors:[err], data: [] });
    }
}
exports.device_flights = function (req, res, next) {
    try {
        log.info("device_reservation");
        Device.find({ _id: req.params._id, flights: { $exists: true, $not: { $size: 0 } } })
            .select('flights')
            .populate('flights')
            .exec(function (err, results) {
                if (err) {
                    log.error(err);
                    res.status(400).json({ success: false,errors: [err], data: [] });
                    return ;
                }
                log.info(results);
                res.status(202).json({ success: true, errors: [],data: results[0].flights });
               return;
                if (list_members.length == 0) {
                    res.status(202).json({ success: true, errors: [],data: [] });
                    return;
                }
                let data = list_members[0].flights;
                console.log(data);
                FlightReservation.find().where('_id').in(data).populate('member').exec((err, records) => {
                    log.info(records);
                    if (err) {
                        res.status(400).json({ success: false, errors:[err], data: records });
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
        res.status(501).json({ success: false, errors:[err], data: [] });
    }
}

exports.create = [
    body('device_type').trim().isLength(24).escape().withMessage('_id_device_type must be valid'),
    body('device_id',"lenght > 3 and only [0-9] [A-Z]").custom((value,{req}) =>{
        return /^[A-Z0-9]{4,}$/.test(value)
    } ),
    async function(req,res,next){
        let newDevice1;
        try{
            newDevice1 =  req.body;
            newDevice1._id = null
            
            log.info("device/create/body", req.body,newDevice1);
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return res.status(400).json({success: false, validation : errors, data: req.body});
            }
            const device_type = await DeviceType.findById(req.body.device_type).exec();
            if(device_type == null){
                res.status(400).json({success: false, errors : ["DeviceType Not Exist"], data: []});
                return;
            }
            const isExsit = await Device.findOne({device_id: req.body.device_id}).exec();
            if(isExsit){
                res.status(400).json({success: false, errors : ["device_id already Exist"], data: []});
                return;
            }
            let newDevice = new Device(newDevice1);
            
            log.info("device/create/newDevice",newDevice);
            newDevice.save((err,result) => {
                if(err){
                    return res.status(400).json({ success: false, errors: [err], message: "Failed To Save", data: newDevice })
                }
                if(result){
                    log.info("notice_create/save/Result", result);
                    return res.status(201).json({ success: true, errors: [], data: result })
                }
            })
            
        }
        catch(err){
            log.error("device/create/exception", err);
            res.status(501).json({success: false, errors : [err], data: []});
        }
    }

]

exports.update = [
    body('_id').trim().isLength(24).escape().withMessage('_id'),
    body('device_type').trim().isLength(24).escape().withMessage('_id_device_type must be valid'),
    body('device_id',"lenght > 3 and only [0-9] [A-Z]").custom((value,{req}) =>{
        return /^[A-Z0-9]{4,}$/.test(value)
    } ),
    async function(req,res,next){
        try{
            log.info("device/update/body", req.body);
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return res.status(400).json({success: false, validation : errors, data: req.body});
            }
            const device_type = await DeviceType.findById(req.body.device_type).exec();
            if(device_type == null){
                res.status(400).json({success: false, errors : ["DeviceType Not Exist"], data: []});
                return;
            }
            
            const _id = req.body._id;
            
            let newDevice = new Device(req.body);
            
            log.info("device/update/newDevice",newDevice);
            Device.updateOne({_id: _id},req.body,(err,result) => {
                if(err){
                    return res.status(400).json({ success: false, errors: [err.message], message: "Failed To Save", data: newDevice })
                }
                if(result){
                    log.info("device/update/Result", result);
                    return res.status(201).json({ success: true, errors: [], data: result })
                }
            })
            
        }
        catch(err){
            log.error("device/update/exception", err);
            res.status(501).json({success: false, errors : [err], data: []});
        }
    }

]

exports.delete = [
    param('_id').trim().isLength(24).escape().withMessage('_id'),
    async function(req,res,next){
        try{
            log.info("device/delete/params", req.params);
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return res.status(400).json({success: false, validation : errors, data: req.body});
            }
            Device.deleteOne({_id: req.params._id},(err,result) => {
                if(err){
                    return res.status(400).json({ success: false, errors: [err.message], message: "Failed To Save", data: newDevice })
                }
                if(result){
                    log.info("device/delete/Result", result);
                    return res.status(201).json({ success: true, errors: [], data: result })
                }
            })
            
        }
        catch(err){
            log.error("device/delete/exception", err);
            res.status(501).json({success: false, errors : [err], data: []});
        }
    }

]


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