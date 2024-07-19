const log = require('debug-level').log('OrderController');
const { body, param, validationResult } = require('express-validator');
const { ApplicationError } = require('../middleware/baseErrors');
const Order = require('../Models/order');
const Flight = require('../Models/flight');
const Device = require('../Models/device');
const Member = require('../Models/member');
const Memberships = require('../Models/membership');
const { findOrders } = require('../Services/OrderService');
const { default: mongoose } = require('mongoose');
const { CValidationError } = require('../Utils/CValidationError');
const constants = require('../Models/constants');

exports.order_list = function (req, res, next) {
  try {
    log.info('order_list/body', req.body, req.params, req.query);
    Order.find(req.body.filter === undefined ? {} : req.body.filter, req.body.find_select === undefined ? {} : req.body.find_select)
      .populate('member')
      .select(req.body.select === undefined ? "" : req.body.select)
      .sort([['order_date', 'ascending']])
      .exec((err, results) => {
        if (err) {
          log.error(err);
          return res.status(400).json({ success: false, errors: [err], data: [] });

        }
        log.info(results);
        return res.status(201).json({ success: true, errors: [], data: results });
      })
  }
  catch (error) {
    return next(new ApplicationError("order_list", 400, "CONTROLLER.ORDER.ORDER_LIST.EXCEPTION", { name: "EXCEPTION", error }));
  }
}
exports.order_search = [async function (req, res, next) {
  try {
    log.info('order_search/params', req.query);
    /* let from = new Date(req.query.from);
    let to = new Date(req.query.to);
    let filter = {order_date: {$gte : from, $lte: to}};
    if(isNaN(from) || isNaN(to)){
      filter = {}
    } */
    const { orders } = await findOrders(req.query);
    res.status(201).json({ success: true, errors: [], data: orders });
    return;
  }
  catch (error) {
    return next(new ApplicationError("order_search", 400, "CONTROLLER.ORDER.ORDER_SEARCH.EXCEPTION", { name: "EXCEPTION", error }));
  }
}
]
exports.order = [
  param('_id').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id'),
  async function (req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("order", 400, "CONTROLLER.ORDER.ORDER.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const order = await Order.findById(req.params._id);
      if (order === null) {
        return res.status(400).json({ success: false, errors: ["Order Not Exist"], data: [] });
      }
      return res.status(201).json({ success: true, errors: [], data: order });
    }
    catch (error) {
      return next(new ApplicationError("order", 400, "CONTROLLER.ORDER.ORDER.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]

exports.order_create = [
  body("product").isLength({ min: 24, max: 24 }).withMessage("product must be 24 characters"),
  body("units", "Units mustbe a number ").notEmpty().isNumeric(),
  body("pricePeUnit", "pricePeUnitbe a must number ").notEmpty().isNumeric(),
  body("amount", "products must be anumber ").notEmpty().isNumeric(),
  async function (req, res, next) {
    const session = await mongoose.startSession();

    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(new ApplicationError("order_create", 400, "CONTROLLER.ORDER.ORDER_CREATE.VALIDATION", { name: "ExpressValidator", errors }));
      }
      session.startTransaction();
      const order = await Order.create(req.body);

      if (order === null) {
        session.abortTransaction()
        return res.status(400).json({ success: false, errors: ["Order Not Exist"], data: [] });
      }
      if (req.body.orderType.referance === "Flight") {
        //positional operator
        const year = new Date(req.body.order_date).getFullYear();
        let member = await Member.find({_id: req.body.member._id,"flights_summary.year": year})
        if(member.length == 0){
          member = await Member.updateOne({_id: req.body.member._id},{$addToSet: {flights_summary: {year: year,total:0}}})
        }
        const updated = await Member.updateMany(
          {
            _id: req.body.member._id
          },
          {
            "$inc": {
              "flights_summary.$[item].total": req.body.units
            }
          },
          {
            "arrayFilters": [
              { "item.year": year }
            ]
          }
        )
        Flight.updateOne({ _id: req.body.product }, { status: "CLOSE" }).exec((err, result) => {
          if (err) {
            session.abortTransaction()
            return res.status(400).json({ success: false, errors: err, data: [] });
          }
          else {
            return res.status(201).json({ success: true, errors: [], data: order });
          }
        })

      }
      
    }
    catch (error) {
      session.abortTransaction()
      return next(new ApplicationError("order_create", 400, "CONTROLLER.ORDER.ORDER_CREATE.EXCEPTION", { name: "EXCEPTION", error }));
    }
    finally {
      await session.endSession();
    }
  }
]
exports.order_quarter_create = [
  body("device_Id").isLength({ min: 24, max: 24 }).withMessage("must be 24 characters"),
  async function (req, res, next) {
    const session = await mongoose.startSession();
    const device = req.body.device_Id;
    const members = req.body.members_Id;
    const description = req.body.description;
    const date = req.body.date;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("order_quarter_create", 400, "CONTROLLER.ORDER.ORDER_QUARTER_CREATE.VALIDATION", { name: "ExpressValidator", errors }));
      }

      session.startTransaction();
      const selectedDevice = await Device.findById(device).exec();
      if (selectedDevice == null) {
        await session.abortTransaction();
        return next(new ApplicationError("order_quarter_create", 400, "CONTROLLER.ORDER.ORDER_QUARTER_CREATE.VALIDATION", { name: "Validator", errors: (new CValidationError(device, `Device not found`, 'device_id', "DB.ClubAccount")).validationResult.errors }));
      }
      const memberships = await Memberships.find().exec();
      if (memberships == null) {
        await session.abortTransaction();
        return next(new ApplicationError("order_quarter_create", 400, "CONTROLLER.ORDER.ORDER_QUARTER_CREATE.VALIDATION", { name: "Validator", errors: (new CValidationError("Gold", `Membership not found`, 'rank', "DB.ClubAccount")).validationResult.errors }));
      }
      let promises = [];
      if (Array.isArray(members)) {
        promises = members.map(async (member) => {
          let memberShip = member.memberships;
          let currentMember = await Member.findOne({ _id: member }).select("membership").populate("membership").exec();
          console.log("member", currentMember)
          let price = currentMember.membership.montly_price;
          let order = new Order({
            order_date: new Date(date),
            units: 3,
            pricePeUnit: currentMember.membership.montly_price,
            amount: 3 * currentMember.membership.montly_price,
            orderType: {
              operation: "Credit",
              referance: "Montly"
            },
            description: description,
            status: constants.OrderStatus.CREATED,
            member: member
          });
          log.info("Quarder for:", order._doc);
          order.save((err, results) => {
            if (err) {
              session.abortTransaction();
              log.error("order_quarter_create.Save", err)
              let appError = new ApplicationError("add_account", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_ACCOUNT.DB", err);
              return next(appError);
            }
            else {
              log.info("order_quarter_create.Save", results)
              /* return res.status(201).json({ success: true, errors: [], data: results }) */
            }
          })
        })
      }
      await Promise.all(promises)
      return res.status(201).json({ success: true, errors: [], data: [] })
    }
    catch (error) {
      await session.abortTransaction();
      return next(new ApplicationError("order_quarter_create", 400, "CONTROLLER.ORDER.ORDER_QUARTER_CREATE.EXCEPTION", { name: "EXCEPTION", error }));
    }
    finally {
      await session.endSession();
    }
  }
]

exports.order_expense_create = [
  
  async function (req, res, next) {
    const session = await mongoose.startSession();
    const amount = req.body.amount;
    const members = req.body.members_Id;
    const description = req.body.description;
    const date = req.body.date;
    try {

      session.startTransaction();
      
      let promises = [];
      if (Array.isArray(members)) {
        promises = members.map(async (member) => {
          
          let order = new Order({
            order_date: new Date(date),
            units: 1,
            pricePeUnit: amount,
            amount: amount,
            orderType: {
              operation: "Credit",
              referance: "Expense"
            },
            description: description,
            status: constants.OrderStatus.CREATED,
            member: member
          });
          log.info("Expense for:", order._doc);
          order.save((err, results) => {
            if (err) {
              session.abortTransaction();
              log.error("order_expense_create.Save", err)
              let appError = new ApplicationError("add_account", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_ACCOUNT.DB", err);
              return next(appError);
            }
            else {
              log.info("order_expense_create.Save", results)
              /* return res.status(201).json({ success: true, errors: [], data: results }) */
            }
          })
        })
      }
      await Promise.all(promises)
      return res.status(201).json({ success: true, errors: [], data: [] })
    }
    catch (error) {
      await session.abortTransaction();
      return next(new ApplicationError("order_expense_create", 400, "CONTROLLER.ORDER.ORDER_EXPENSE_CREATE.EXCEPTION", { name: "EXCEPTION", error }));
    }
    finally {
      await session.endSession();
    }
  }
]
exports.order_update = [
  body("_id").isLength({ min: 24, max: 24 }).withMessage("_id must be 24 characters"),
  body("product").isLength({ min: 24, max: 24 }).withMessage("product must be 24 characters"),
  body("units", "Units must be a number ").notEmpty().isNumeric(),
  body("pricePeUnit", "pricePeUnit must be a number ").notEmpty().isNumeric(),
  body("amount", "products must be a number ").notEmpty().isNumeric(),
  async function (req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("order_update", 400, "CONTROLLER.ORDER.ORDER_UPDATE.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const order = await Order.findByIdAndUpdate(req.body._id, req.body).exec();
      if (order) {
        return res.status(201).json({ success: true, errors: [], data: order })
      }
      return res.status(400).json({ success: false, errors: ["Order update failed"], data: [] })

    }
    catch (error) {
      return next(new ApplicationError("order_update", 400, "CONTROLLER.ORDER.ORDER_UPDATE.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]

exports.order_delete = [
  body('_id').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id'),
  async function (req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("order_delete", 400, "CONTROLLER.ORDER.ORDER_DELETE.VALIDATION", { name: "ExpressValidator", errors }));
      }
      Order.findByIdAndDelete(req.body._id, (err, result) => {
        if (err) {
          return res.status(400).json({ success: false, errors: [err.message], message: "Failed To Delete", data: [] })
        }
        if (result) {
          log.info("order_delete/Result", result);
          return res.status(201).json({ success: true, errors: [], data: result })
        }
      })
    }
    catch (error) {
      return next(new ApplicationError("order_delete", 400, "CONTROLLER.ORDER.ORDER_DELETE.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]




