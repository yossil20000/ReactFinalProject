const log = require('debug-level').log('ImageController');
const { body, param, validationResult } = require('express-validator');
const { ApplicationError } = require('../middleware/baseErrors');
const Image = require('../Models/Images');

exports.image_list = function (req, res, next) {
    try {
        log.info('image_list/req', req.body);
        Image.find()
            .exec(function (err, list_images) {
                if (err) {
                    return next(err); log.debug(err);
                }
                else {
                    log.info('image_list/results',list_images.length );
                    res.status(201).json({ success: true, errors: [], data: list_images });
                    return;
                }
            });
    }
    catch (error) {
        return next(new ApplicationError("image_list","400","CONTROLLER.INAGE.IMAGE_LIST.EXCEPTION",{name: "EXCEPTION", error}));
    }
}
exports.image = [
    param('_id').trim().isLength(24).escape().withMessage('_id_device must be valid 24 characters'),
    async (req, res, next) => {
        try {
            log.info("image/req", req.params);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ApplicationError("image","400","CONTROLLER.IMAGE.VALIDATION",{name: "ExpressValidator", errors}));
            }
            const image = await Image.findById(req.params._id).exec();
            if (image === null || image === undefined) {
                return res.status(400).json({ success: false, errors: ["image Not Exist"], data: [] })
            }
            return res.status(201).json({ success: true, errors: [], data: image })
        }
        catch (error) {
            return next(new ApplicationError("image","400","CONTROLLER.INAGE.IMAGE.EXCEPTION",{name: "EXCEPTION", error}));
        }

    }
]

exports.image_create = [
    body('title').trim().isLength({ min: 1 }).withMessage("title must be with length > 0"),
    body('author').trim().isLength({ min: 1 }).withMessage("author must be with length > 0"),
    async (req, res, next) => {
        try {
            log.info("image_create", req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ApplicationError("image_create","400","CONTROLLER.IMAGE.CREATE.VALIDATION",{name: "ExpressValidator", errors}));
            }
            const image = new Image({
                title: req.body.title,
                author: req.body.author,
                image: req.body.image
            })
            image.save((err, result) => {
                if (err) {
                    return res.status(400).json({ success: false, errors: [err], message: "Failed To Save", data: image })
                }
                if (result) {
                    log.info("image_create/save/Result", result);
                    return res.status(201).json({ success: true, errors: [], data: image })
                }
            })
        }
        catch (error) {
            return next(new ApplicationError("image_create","400","CONTROLLER.IMAGE.IMAGE_CREATE.EXCEPTION",{name: "EXCEPTION", error}));
        }
    }
]

exports.image_update = [
    body("_id").isLength(24).withMessage("_id must be 24 characters"),
    body('title').trim().isLength({ min: 1 }).withMessage("title must be with length > 0"),
    body('author').trim().isLength({ min: 1 }).withMessage("author must be with length > 0"),
    async (req, res, next) => {
        try {
            log.info("image_update", req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ApplicationError("Status update","400","CONTROLLER.IMAGE.UPDATE.VALIDATION",{name: "ExpressValidator", errors}));
            }
            const image = await Image.findByIdAndUpdate(req.body._id, req.body).exec();
            if (image) {
                return res.status(201).json({ success: true, errors: [], data: image })
            }
            return res.status(400).json({ success: false, errors: ["image update failed"], data: [] })
        }
        catch (error) {
            return next(new ApplicationError("image_update","400","CONTROLLER.IMAGE.IMAGE_UPDATE.EXCEPTION",{name: "EXCEPTION", error}));
        }
    }
]

exports.image_delete = [
    
    body('_id').trim().isLength(24).escape().withMessage('_id_device must be valid 24 characters'),
    async (req, res, next) => {
        try {
            log.info("image_delete/req", req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ApplicationError("Status update","400","CONTROLLER.IMAGE.DELETE.VALIDATION",{name: "ExpressValidator", errors}));
            }
            const image = await Image.findByIdAndDelete(req.body._id).exec();
            if (image === null || image === undefined) {
                return res.status(400).json({ success: false, errors: ["image Not Exist"], data: [] })
            }
            return res.status(201).json({ success: true, errors: [], data: image })
        }
        catch (error) {
            return next(new ApplicationError("image_delete","400","CONTROLLER.IMAGE.IMAGE_DELETE.EXCEPTION",{name: "EXCEPTION", error}));
        }

    }
]


