const log = require('debug-level').log('TypeController');
const { body, param, validationResult } = require('express-validator');
const { ApplicationError } = require('../middleware/baseErrors');
const {SelectionType} = require('../Models/orderType')

exports.type = [
 
  async function (req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("type", 400, "CONTROLLER.TYPE.TYPE.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const selection = await SelectionType.findOne({key: req.params.key});
      if (selection === null) {
        
        return res.status(400).json({ success: false, errors: ["Type Not Exist"], data: [] });
      }
      return res.status(201).json({ success: true, errors: [], data: selection });
    }
    catch (error) {
      return next(new ApplicationError("type", 400, "CONTROLLER.TYPE.TYPE.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]