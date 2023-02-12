const log = require('debug-level').log('TypeController');
const { body, param, validationResult } = require('express-validator');
const { ApplicationError } = require('../middleware/baseErrors');
const {SelectionType} = require('../Models/orderType')

exports.expense_type = [
 param("key","key length not valid").isLength({min: 0}),
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
exports.create_type = [
  body("key","key length not valid").isLength({min: 0}),
   async function (req, res, next) {
     try {
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         return next(new ApplicationError("type", 400, "CONTROLLER.TYPE.TYPE.VALIDATION", { name: "ExpressValidator", errors }));
       }
       const selection = await SelectionType.create({key: req.body.key,values: req.body.values});
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
 
