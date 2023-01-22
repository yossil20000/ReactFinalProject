const Membership = require('../Models/membership');
const { ApplicationError } = require('../middleware/baseErrors');

const log = require('debug-level').log('membershipController');
var { body, validationResult } = require('express-validator');


exports.membership_list = function (req, res, next) {
    try {
        log.info("membership_list");
        Membership.find()
            .exec(function (err, list_memberships) {
                if (err) {
                    res.status(400).json({ success: false, errors: [err], data: [] });
                    return;
                }
                else {
                    res.status(201).json({ success: true, errors: [], data: list_memberships })
                }
            })
    }
    catch (error) {

    }

}

exports.membership_combo = function (req, res, next) {
    try {
        log.info("membership_combo", req.body);
        Device.find(req.body.filter === undefined ? {} : req.body.filter, req.body.find_select === undefined ? {} : req.body.find_select)
            .select('_id name rank')
            .sort([['name', 'ascending']])
            .exec(function (err, list_combo) {
                if (err) { return next(err); }
                res.status(201).json({ success: true, errors: [], data: list_combo });
            })
    }
    catch (error) {
        return next(new ApplicationError("combo", 400, "CONTROLLER.DEVICE.DEVICE_COMBO.EXCEPTION", { name: "EXCEPTION", error }));
    }
}
exports.membership_update = [
    body('_id').trim().isLength({ min: 24, max:24 }).escape().withMessage('_id_device must be valid 24 characters'),
    body('name').trim().isLength({ min: 1 }).escape().withMessage('name must be specified'),
    body('entry_price',"Value must be >= 0").custom((value) => value >= 0),
    body('hour_disc_percet',"Value must between  [0 - 100]").custom((value) => value >= 0 && value <= 100),
    body('montly_price',"Value must be >= 0").custom((value) => value >= 0),
    (req, res, next) => {
        try{
        log.info(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ApplicationError("membership_update", 400, "CONTROLLER.MEMBERSHIP.UPDATE.VALIDATION", { name: "ExpressValidator",errors }));
        }
        else {
            
            Membership.updateOne({_id: req.body._id}, req.body,(err, results) => {
                if (err) {
                    res.status(400).json({ success: false, errors: [err], data: [] });
                    return;
                }
                res.status(201).json({ success: true, errors: [], data: results });
                return;
            });

        }
        //res.status(201).json({success: true, errors : [], data: req.body});
        return;
    }
    catch(error){
        return next(new ApplicationError("membership_update", 400, "CONTROLLER.MEMBERSHIP.UPDATE.EXCEPTION", { name: "EXCEPTION", error }));
    }
    }
];