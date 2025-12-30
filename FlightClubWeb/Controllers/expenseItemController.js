const log = require('debug-level').log('ClubNoticeController');
const { body, param, validationResult } = require('express-validator');
const { ApplicationError } = require('../middleware/baseErrors');
const { CValidationError } = require('../Utils/CValidationError');
const ExpenseItem = require('../Models/expenseItem');
const constants = require('../Models/constants')

exports.expense_items = [
  async (req, res, next) => {
    try {
      log.info('expense_item_list/req', req.body);
      const items = await ExpenseItem.find().sort([['item_name', 'ascending']]).exec();
      log.info('expense_item_list/results', items.length);
      res.status(201).json({ success: true, errors: [], data: items });
      return;
    }
    catch (error) {
      return next(new ApplicationError("expense_item_list", 400, "CONTROLLER.EXPENSE_ITEM.EXPENSE_ITEM_LIST.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]
exports.expense_item = [
  param('_id').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id must be valid 24 characters'),
  async (req, res, next) => {   
    try {
      log.info("expense_item/req", req.params);
      const errors = validationResult(req);   
      if (!errors.isEmpty()) {
        return next(new ApplicationError("expense_item", 400, "CONTROLLER.EXPENSE_ITEM.EXPENSE_ITEM.VALIDATION", { name: "ExpressValidator", errors }));
      } 
      const item = await ExpenseItem.findById(req.params._id).exec();
      if (item === null || item === undefined) {
        return next(new ApplicationError("expense_item", 400, "CONTROLLER.EXPENSE_ITEM.EXPENSE_ITEM.VALIDATION", { name: "Validator", errors: (new CValidationError(req.params._id, `Expense Item fetch failed`, '_id', "DB.ExpenseItem")).validationResult.errors }));
      }
      return res.status(201).json({ success: true, errors: [], data: item })
    }
    catch (error) {
      return next(new ApplicationError("expense_item", 400, "CONTROLLER.EXPENSE_ITEM.EXPENSE_ITEM.EXCEPTION", { name: "EXCEPTION", error }));
    } 
  }
]

exports.expense_item_create = [ 
body('item_name').trim().isLength({ min: 1 }).withMessage("item_name must be with length > 0"),
  body('expense.category').trim().isLength({ min: 1 }).withMessage("category must be with length > 0"),
  body('expense.type').trim().isLength({ min: 1 }).withMessage("type must be with length > 0"),
  body('expense.utilizated').trim().isIn(Object.values(constants.Utilizated)).withMessage("utilizated must be one of " + Object.values(constants.Utilizated).join(",")),
  async (req, res, next) => {
    try {
      log.info("expense_item_create", req.body);
      const errors = validationResult(req); 
      if (!errors.isEmpty()) {
        return next(new ApplicationError("expense_item_create", 400, "CONTROLLER.EXPENSE_ITEM.EXPENSE_ITEM_CREATE.VALIDATION", { name: "ExpressValidator", errors }));
      } 
      const newItem = new ExpenseItem({
        item_name:  req.body.item_name,
        expense: {
          category: req.body.expense.category,
          type: req.body.expense.type,
          utilizated: req.body.expense.utilizated
        } 
      });
      const savedItem =  await newItem.save();
      res.status(201).json({ success: true, errors: [], data: savedItem });
    } 
    catch (error) {
      return next(new ApplicationError("expense_item_create", 400, "CONTROLLER.EXPENSE_ITEM.EXPENSE_ITEM_CREATE.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
] 
exports.expense_item_delete = [
  body('_id').trim().isLength({ min: 24, max: 24 }).withMessage("_id must be valid 24 characters"),
  async (req, res, next) => {
    try {
      log.info("expense_item_delete", req.body);
      const errors = validationResult(req); 
      if (!errors.isEmpty()) {
        return next(new ApplicationError("expense_item_delete", 400, "CONTROLLER.EXPENSE_ITEM.EXPENSE_ITEM_DELETE.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const deletedItem = await ExpenseItem.findByIdAndDelete(req.body._id).exec();
      if (deletedItem === null || deletedItem === undefined) {
        return next(new ApplicationError("expense_item_delete", 400, "CONTROLLER.EXPENSE_ITEM.EXPENSE_ITEM_DELETE.VALIDATION", { name: "Validator", errors: (new CValidationError(req.body._id, `Expense Item delete failed`, '_id', "DB.ExpenseItem")).validationResult.errors }));
      }
      res.status(201).json({ success: true, errors: [], data: deletedItem });
    }
    catch (error) {
      return next(new ApplicationError("expense_item_delete", 400, "CONTROLLER.EXPENSE_ITEM.EXPENSE_ITEM_DELETE.EXCEPTION", { name: "EXCEPTION", error }));
    }  
  }
]
exports.expense_item_update = [
  body('_id').trim().isLength({ min: 24, max: 24 }).withMessage("_id must be valid 24 characters"),
  body('item_name').trim().isLength({ min: 1 }).withMessage("item_name must be with length > 0"),   
  body('expense.category').trim().isLength({ min: 1 }).withMessage("category must be with length > 0"),
  body('expense.type').trim().isLength({ min: 1 }).withMessage("type must be with length > 0"),
  body('expense.utilizated').trim().isIn(Object.values(constants.Utilizated)).withMessage("utilizated must be one of " + Object.values(constants.Utilizated).join(",")),
  async (req, res, next) => {
    try {
      log.info("expense_item_update", req.body);    
      const errors = validationResult(req); 
      if (!errors.isEmpty()) {
        return next(new ApplicationError("expense_item_update", 400, "CONTROLLER.EXPENSE_ITEM.EXPENSE_ITEM_UPDATE.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const updatedItem = await ExpenseItem.findByIdAndUpdate(
        req.body._id,
        { 
          item_name: req.body.item_name,
          expense: {
            category: req.body.category,
            type: req.body.type,
            utilizated: req.body.utilizated
          } 
        },
        { new: true }
      ).exec();
      if (updatedItem === null || updatedItem === undefined) {
        return next(new ApplicationError("expense_item_update", 400, "CONTROLLER.EXPENSE_ITEM.EXPENSE_ITEM_UPDATE.VALIDATION", { name: "Validator", errors: (new CValidationError(req.body._id, `Expense Item update failed`, '_id', "DB.ExpenseItem")).validationResult.errors }));
      } 
      res.status(201).json({ success: true, errors: [], data: updatedItem });
    }
    catch (error) {
      return next(new ApplicationError("expense_item_update", 400, "CONTROLLER.EXPENSE_ITEM.EXPENSE_ITEM_UPDATE.EXCEPTION", { name: "EXCEPTION", error }));
    } 
  }
]
