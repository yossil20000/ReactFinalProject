const mongoose = require('mongoose');
require('../Types/date.extensions')
const fs = require('fs')
var getDirName = require('path').dirname;
const log = require('debug-level').log('ClubAccountController');
const { body, param, validationResult, query } = require('express-validator');
const ClubAccount = require('../Models/clubAccount');
const Order = require('../Models/order');
const { Account } = require('../Models/account');
const { Transaction, TransactionSchema } = require('../Models/transaction')
const { ApplicationError } = require('../middleware/baseErrors');
const { CValidationError } = require('../Utils/CValidationError');
const constants = require('../Models/constants');
const Expense = require('../Models/expense');


const transactionOptions = {
  readPreference: 'primary',
  readConcern: { level: 'local' },
  writeConcern: { w: 'majority' }
};

exports.club = async function (req, res, next) {

  try {
    log.info("club/req.params", req.params);
    const include_accounts = req.params.include_accounts === undefined ? true : req.params.include_accounts
    log.info("club/req.params", req.params.include_accounts);
    const filter = `${include_accounts == "true" ? 'accounts ' : ''}contact`;
    const clubAccount = await ClubAccount.find().populate(filter).exec();
    if (clubAccount) {
      return res.status(201).json({ success: true, errors: [], data: clubAccount });
    }
    return res.status(400).json({ success: false, errors: ["club not exist"], data: [] });

  }
  catch (error) {
    log.error(error);
    return res.status(501).json({ success: false, errors: [error], data: [] });
  }
}

exports.add_account = [
  body('_id').isLength({ min: 24, max: 24 }).withMessage("_id must be 24 characters"),
  body('account_id').isLength({ min: 24, max: 24 }).withMessage("account_id must be 24 characters"),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("add_account", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_ACCOUNT.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const clubAccount = await ClubAccount.findById(req.body._id).exec();
      if (!clubAccount) {
        return next(new ApplicationError("add_account", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_ACCOUNT.VALIDATION", { name: "Validator", errors: (new CValidationError(req.body._id, `Club Account ${req.body._id} not found`, '_id', "DB.ClubAccount")).validationResult.errors }));
      }

      const account = await Account.findById(req.body.account_id).exec();
      if (!account) {
        return next(new ApplicationError("add_account", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_ACCOUNT.VALIDATION", { name: "Validator", errors: (new CValidationError(req.body.account_id, `Account ${req.body.account_id} not found`, 'account_id', "DB.Account")).validationResult.errors }));
      }

      if (clubAccount && account) {
        const foundAccount = clubAccount.accounts.find((account) => account == req.body.account_id)
        if (foundAccount) {
          return next(new ApplicationError("add_account", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_ACCOUNT.VALIDATION", { name: "Validator", errors: (new CValidationError(req.body.account_id, "Account already Exist", 'account_id', "DB")).validationResult.errors }));
        }

        clubAccount.accounts.push(account)
        clubAccount.save((err, results) => {
          if (err) {
            log.error("clubAccount.Save", err)
            let appError = new ApplicationError("add_account", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_ACCOUNT.DB", err);
            return next(appError);
          }
          else {
            log.info("clubAccount.Save", results)
            return res.status(201).json({ success: true, data: results });
          }
        })
      }


    }
    catch (error) {
      return next(new ApplicationError("add_account", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_ACCOUNT.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }

]
exports.club_create_account = [
  body('_id').isLength({ min: 24, max: 24 }).withMessage("_id must be 24 characters"),
  param('member_id').isLength({ min: 24, max: 24 }).withMessage("_id must be 24 characters"),
  async (req, res, next) => {

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("club_create", 400, "CONTROLLER.CLUB.CREATE.VALIDATION", { name: "ExpressValidator", errors }));
      }

      const account = new Account({
        account_id: "CA000001",
        member: req.body.member_id,
        balance: 0,
        description: req.body.description === undefined ? "" : req.body.description
      })
      club = new Club({
        account: account
      })
    }
    catch (error) {
      return next(new ApplicationError("club_create", 400, "CONTROLLER.CLUB.CLUB_CREATE.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]

exports.combo = function (req, res, next) {
  try {
    log.info("combo/filter", req.body);
    ClubAccount.find(req?.body?.filter === undefined ? {} : req.body.filter, req.body.find_select === undefined ? {} : req.body.find_select)
      .select("accounts _id  club")
      .populate({
        path: "accounts", model: "Account", select: { "_id": 1, "account_id": 1 }
        , populate: [{
          path: 'member',
          model: "Member",
          select: { "_id": 1, "family_name": 1, "member_id": 1, "member_type": 1, "first_name": 1 }
        }]
      })


      .exec(function (err, list_members) {
        if (err) { return next(err); }
        res.status(201).json({ success: true, errors: [], data: list_members });
      })
  }
  catch (error) {
    return next(new ApplicationError("combo", 400, "CONTROLLER.MEMBER.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
  }
}
const getTranctionName = (source, sourceAccount) => {
  if (source.accountType === constants.EAccountType.BANK) {
    return `${sourceAccount.club.brand}/${sourceAccount.club.branch}/${sourceAccount.club.account_id}`
  }
  else {
    return `${sourceAccount.member.member_id}/${sourceAccount.member.family_name}/${sourceAccount.account_id}`
  }
}
exports.add_order_transaction = [
  body('destination.accountType').isLength({ min: 6, max: 6 }).withMessage("destination must be valid"),
  body('destination._id').isLength({ min: 24, max: 24 }).withMessage("source must be 24 characters"),
  body('source.accountType').isLength({ min: 6, max: 6 }).withMessage("source must be valid"),
  body('amount', "Must be number").isNumeric(),
  body('order._id').isLength({ min: 24, max: 24 }).withMessage("order._id must be 24 characters"),
  body('order.type').isLength({ min: 1 }).withMessage("order.type must valid"),
  body('payment.method').isLength({ min: 1 }).withMessage("Payment methos is missing"),
  async (req, res, next) => {
    try {

      let { source, destination, amount, order, description, payment, type } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUBACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const orderDoc = await Order.findById(order._id).select("member").lean().exec();
      var destinationAccount = await Account.findOne({ "member": orderDoc.member }).populate('member').exec();
      /* 
      log.info("Find member", orderDoc);
      log.info("Find member", orderDoc.member);
      const { member } = orderDoc;
      log.info("Find member/memberId.member", member);

     */
      /*     if (destination._id === "") {
            if (!account || account === undefined) {
              return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(source._id, `Account not found`, 'source', "DB.ClubAccount")).validationResult.errors }));
            }
            destination._id = account["_id"].toString();
          } */

      /* Transaction */
      const session = await mongoose.startSession();
      try {
        session.startTransaction();

        /* const transactionResult = await session.withTransaction(async () => { */
        var sourceAccount;

        if (source.accountType == "100100") {
          sourceAccount = await ClubAccount.findById({ _id: source._id }).exec();
        }
        /* 
        else if (source.accountType == "200200")
          sourceAccount = await Account.findById({ _id: source._id }).populate('member');
        else {
          await session.abortTransaction();
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(source._id, `Account not found`, 'source', "DB.ClubAccount")).validationResult.errors }));
        }
        if (destination.accountType === "100100") {
          destinationAccount = await ClubAccount.findById({ _id: destination._id });
        } else if (destination.accountType === "200200") {
          destinationAccount = await Account.findById({'member._id': destination._id }).populate('member');
        }
         */
        else {
          await session.abortTransaction();
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(destination._id, `Account not found`, 'destination', "DB.ClubAccount")).validationResult.errors }));
        }
        log.info("sourceAccount", sourceAccount);
        log.info("destinationAccount", destinationAccount)
        const orderTransaction = await Order.findById({ _id: order._id }).exec();


        if (!sourceAccount) {
          await session.abortTransaction();
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(source, `Account not found`, 'source', "DB.ClubAccount")).validationResult.errors }));
        }

        if (!destinationAccount) {
          await session.abortTransaction();
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(destination, `Account not found`, 'destination', "DB.ClubAccount")).validationResult.errors }));
        }

        if (!orderTransaction) {
          await session.abortTransaction();
          return next(new ApplicationError("add_account", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(order, `Order not found`, 'order', "DB.ClubAccount")).validationResult.errors }));
        }
        if (orderTransaction.status === constants.OrderStatus.CLOSE) {
          await session.abortTransaction();
          return next(new ApplicationError("add_account", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(orderTransaction.status, `Order Status Already Closed`, 'order.status', "DB.ClubAccount")).validationResult.errors }));
        }
        const tSource = getTranctionName(source, sourceAccount);
        log.info("tSource", tSource)
        const tDestination = getTranctionName(destination, destinationAccount);
        log.info("tDestination", tDestination)

        let sourceTransaction = new Transaction({
          source: tSource,
          destination: tDestination,
          amount: -Number(Number(amount).toFixed(2)),
          type: type.toUpperCase(),
          calculation_type: constants.CalcType.AMOUNT,
          source_balance: Number(sourceAccount.balance.toFixed(2)),
          destination_balance: Number(destinationAccount.balance.toFixed(2)),
          order: {
            _id: order._id.toString(),
            type: order.type
          },
          payment: {
            method: constants.PaymentMethod.NONE
          },
          description: description === undefined ? "" : description
        });
        await sourceTransaction.save({ session })
        sourceAccount.transactions.push(sourceTransaction)


        if (isNaN(sourceAccount.balance)) {
          throw new Error('Source: The new balance is not a number!');
        }


        await sourceAccount.save({ session })
        /* 
                let transactionDestination = new Transaction({
                  source: tDestination,
                  destination: tSource,
                  amount: Number(Number(amount).toFixed(2)),
                  type: type.toUpperCase(),
                  calculation_type: constants.CalcType.AMOUNT,
                  balance: Number(destinationAccount.balance.toFixed(2)),
                  order: {
                    _id: order._id.toString(),
                    type: order.type
                  },
                  payment: {
                    method: constants.PaymentMethod.NONE
                  },
                  description: description === undefined ? "" : description
                });
                
                await transactionDestination.save({ session })
                */
        destinationAccount.balance = Number(destinationAccount.balance.toFixed(2)) - Number(Number(amount).toFixed(2));
        destinationAccount.transactions.push(sourceTransaction)
        /* destinationAccount.balance = Number(destinationAccount.balance.toFixed(2)) + Number(amount.toFixed(2)); */
        if (isNaN(destinationAccount.balance)) {
          throw new Error('Destination: The new balance is not a number!');
        }
        await destinationAccount.save({ session })

        await Order.findByIdAndUpdate(order._id, { status: constants.OrderStatus.CLOSE }, { session })

        await session.commitTransaction();
        const savedCA = await ClubAccount.find().populate('transactions')
        log.info("savedCA", savedCA)
        /*  }, transactionOptions); */
        /*         if (transactionResult) {
                  log.info("trananctionResult/add_transaction update succefully", trananctionResult);
                  return res.status(201).json({ success: true, errors: ["add_transaction success"], data: [] })
                } */

        return res.status(201).json({ success: true, errors: ["add_transaction success"], data: [] })
      }
      catch (error) {
        await session.abortTransaction();
        return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.EXCEPTION", { name: "EXCEPTION", error }));
      }
      finally {

        await session.endSession();
      }

    }
    catch (error) {
      return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]
exports.add_transaction = [
  body('source._id').isLength({ min: 4 }).withMessage("source must at lease 4 characters"),
  body('source.accountType').isLength({ min: 6, max: 6 }).withMessage("must be valid"),
  body('destination._id').isLength({ min: 4 }).withMessage("destination must at least 4 characters"),
  body('destination.accountType').isLength({ min: 4, max: 6 }).withMessage("must be valid"),
  body('amount', "Must be number").isNumeric(),
  body('type').isLength({ min: 1 }),
  body('order._id').isLength({ min: 0, max: 24 }).withMessage("order._id must be max 24 characters"),
  body('order.type').isLength({ min: 1 }).withMessage("order.type must valid"),

  async (req, res, next) => {
    try {
      let { source, destination, amount, order, description, payment, type, date } = req.body;
      type = type.toUpperCase();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("add_expanse_transaction", 400, "CONTROLLER.CLUBACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "ExpressValidator", errors }));
      }

      /* Transaction */
      const session = await mongoose.startSession();
      try {
        session.startTransaction();

        const expense = await Expense.findById(order._id).exec();
        if (expense) {
          expense.status = constants.OrderStatus.CLOSE;
          await expense.save({ session });
        }
        else {
          await session.abortTransaction();
          return next(new ApplicationError("add_expanse_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(order._id, `Expense not found`, 'order._id', "DB.ClubAccount")).validationResult.errors }));
        }

        /* const transactionResult = await session.withTransaction(async () => { */
        var sourceAccount;
        var destinationAccount;
        if (source.accountType == constants.EAccountType.BANK)
          sourceAccount = await ClubAccount.findOne({ account_id: source._id }).exec();
        else {
          await session.abortTransaction();
          return next(new ApplicationError("add_expanse_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(source._id, `Account not found`, 'source', "DB.ClubAccount")).validationResult.errors }));
        }
        if (destination.accountType === constants.EAccountType.MEMBER || destination.accountType === constants.EAccountType.SUPPLIERS) {
          destinationAccount = await Account.findOne({ account_id: destination._id }).populate('member');
        } else {
          await session.abortTransaction();
          return next(new ApplicationError("add_expanse_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(destination._id, `Account not found`, 'destination', "DB.ClubAccount")).validationResult.errors }));
        }
        log.info("sourceAccount", sourceAccount);
        log.info("destinationAccount", destinationAccount)


        if (!sourceAccount) {
          await session.abortTransaction();
          return next(new ApplicationError("add_expanse_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(source, `Account not found`, 'source', "DB.ClubAccount")).validationResult.errors }));
        }

        if (!destinationAccount) {
          await session.abortTransaction();
          return next(new ApplicationError("add_expanse_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(destination, `Account not found`, 'destination', "DB.ClubAccount")).validationResult.errors }));
        }


        const tSource = getTranctionName(source, sourceAccount);
        log.info("tSource", tSource)
        const tDestination = getTranctionName(destination, destinationAccount);
        log.info("tDestination", tDestination)
        let calcAmount = 0;
        if (type == 'DEBIT')
          calcAmount = Number(Number(amount).toFixed(2));
        else if (type == 'CREDIT')
          calcAmount = -Number(Number(amount).toFixed(2));
        else
          throw new Error('Invalid type operation!');

        const sourceTransaction = new Transaction({
          source: tSource,
          destination: tDestination,
          amount: calcAmount,
          source_balance: Number(sourceAccount.balance.toFixed(2)),
          destination_balance: Number(destinationAccount.balance.toFixed(2)),
          type: type,
          calculation_type: constants.CalcType.AMOUNT,
          date: date,
          description: description,
          payment: payment,
          order: order
        });

        if (isNaN(sourceAccount.balance)) {
          throw new Error('Source: The new balance is not a number!');
        }
        await sourceTransaction.save({ session });
        sourceAccount.transactions.push(sourceTransaction);
        await sourceAccount.save({ session })

        /* 
                const destinationTransaction = new Transaction({
                  source: tDestination,
                  destination: tSource,
                  amount: -calcAmount,
                  balance: Number(destinationAccount.balance.toFixed(2)),
                  type: type,
                  calculation_type: constants.CalcType.AMOUNT,
                  date: date,
                  description: description,
                  payment: payment,
                  order: order
                });
        
                destinationAccount.transactions.push(destinationTransaction);
                destinationTransaction.save({ session })
         */

        destinationAccount.transactions.push(sourceTransaction);

        destinationAccount.balance = Number(destinationAccount.balance.toFixed(2)) + calcAmount;

        if (isNaN(destinationAccount.balance)) {
          throw new Error('Destination: The new balance is not a number!');
        }
        destinationAccount.balance = Number(destinationAccount.balance.toFixed(2))
        await destinationAccount.save({ session })


        /* await Order.findByIdAndUpdate(order,{status: constants.OrderStatus.CLOSE},{session})
         */
        await session.commitTransaction();
        /*         const savedCA = await ClubAccount.find().populate('transactions')
                log.info("savedCA", savedCA) */
        /*  }, transactionOptions); */
        /*         if (transactionResult) {
                  log.info("trananctionResult/add_transaction update succefully", trananctionResult);
                  return res.status(201).json({ success: true, errors: ["add_transaction success"], data: [] })
                } */

        return res.status(201).json({ success: true, errors: ["add_transaction success"], data: [] })
      }
      catch (error) {
        await session.abortTransaction();
        return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.EXCEPTION", { name: "EXCEPTION", error }));
      }
      finally {

        await session.endSession();
      }

    }
    catch (error) {
      return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]
exports.add_transaction_Type = [
  body('source._id').isLength({ min: 4 }).withMessage("source must at lease 4 characters"),
  body('source.accountType').isLength({ min: 6, max: 6 }).withMessage("must be valid"),
  body('destination._id').isLength({ min: 4 }).withMessage("destination must at least 4 characters"),
  body('destination.accountType').isLength({ min: 4, max: 6 }).withMessage("must be valid"),
  body('amount', "Must be number").isNumeric(),
  body('type').isLength({ min: 1 }),
  body('order._id').isLength({ min: 0, max: 24 }).withMessage("order._id must be max 24 characters"),
  body('order.type').isLength({ min: 1 }).withMessage("order.type must valid"),

  async (req, res, next) => {
    try {
      let { source, destination, amount, order, description, payment, type } = req.body;
      type = type.toUpperCase();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUBACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "ExpressValidator", errors }));
      }

      /* Transaction */
      const session = await mongoose.startSession();
      try {
        session.startTransaction();
        if (order.type.referance == constants.OrderTypeReferance.Expense) {
          const expense = await Expense.findById(order._id).exec();
          if (expense) {
            expense.status = constants.OrderStatus.CLOSE;
            await expense.save({ session });
          }
          else {
            await session.abortTransaction();
            return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(order._id, `Expense not found`, 'order._id', "DB.ClubAccount")).validationResult.errors }));
          }
        }
        /* const transactionResult = await session.withTransaction(async () => { */
        var sourceAccount;
        var destinationAccount;

        let isSourceBank = source.accountType == constants.EAccountType.BANK;
        let isDenstinationBank = destination.accountType == constants.EAccountType.BANK;
        let isSourceAccount = source.accountType == constants.EAccountType.MEMBER || source.accountType == constants.EAccountType.SUPPLIERS;
        let isDenstinationAccount = destination.accountType == constants.EAccountType.MEMBER || destination.accountType == constants.EAccountType.SUPPLIERS;
        if (isSourceBank) {
          sourceAccount = await ClubAccount.findOne({ account_id: source._id }).exec();
        }
        else if (isSourceAccount)
          sourceAccount = await Account.findOne({ account_id: source._id }).populate('member');
        else {
          await session.abortTransaction();
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(source._id, `Account not found`, 'source', "DB.ClubAccount")).validationResult.errors }));
        }
        if (isDenstinationBank) {
          destinationAccount = await ClubAccount.findOne({ account_id: destination._id });
        } else if (isDenstinationAccount) {
          destinationAccount = await Account.findOne({ account_id: destination._id }).populate('member');
        } else {
          await session.abortTransaction();
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(destination._id, `Account not found`, 'destination', "DB.ClubAccount")).validationResult.errors }));
        }
        log.info("sourceAccount", sourceAccount);
        log.info("destinationAccount", destinationAccount)


        if (!sourceAccount) {
          await session.abortTransaction();
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(source, `Account not found`, 'source', "DB.ClubAccount")).validationResult.errors }));
        }

        if (!destinationAccount) {
          await session.abortTransaction();
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(destination, `Account not found`, 'destination', "DB.ClubAccount")).validationResult.errors }));
        }

        const tSource = getTranctionName(source, sourceAccount);
        log.info("tSource", tSource)
        const tDestination = getTranctionName(destination, destinationAccount);
        log.info("tDestination", tDestination)
        let sourceAmount = 0;
        let destinationAmount = 0;
        if (type == constants.TransactionType.CREDIT) {
          sourceAmount = Number(Number(-amount).toFixed(2));
        }
        else if (type == constants.TransactionType.DEBIT) {
          sourceAmount = Number(Number(amount).toFixed(2));
        }
        else {
          await session.abortTransaction();
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(type, `Transaction Type`, 'type', "DB.ClubAccount")).validationResult.errors }));
        }
        destinationAmount = -sourceAmount
        const sourceTransaction = new Transaction({
          source: tSource,
          destination: tDestination,
          amount: sourceAmount,
          balance: Number(sourceAccount.balance.toFixed(2)),
          type: type,
          calculation_type: constants.CalcType.AMOUNT,
          date: source.date,
          description: description,
          payment: payment,
          order: order
        });


        if (isNaN(sourceAccount.balance)) {
          throw new Error('Source: The new balance is not a number!');
        }

        sourceAccount.transactions.push(sourceTransaction);
        await sourceAccount.save({ session })
        await sourceTransaction.save({ session });
        /*         
                const destinationTransaction = new Transaction({
                  source: tDestination ,
                  destination: tSource ,
                  amount: destinationAmount,
                  balance: Number(destinationAccount.balance.toFixed(2)),
                  type: type,
                  calculation_type: constants.CalcType.AMOUNT,
                  date: source.date,
                  description: description,
                  payment: payment,
                  order: order
                });
                destinationAccount.transactions.push(destinationTransaction);
         */
        destinationAccount.transactions.push(sourceTransaction);
        await destinationTransaction.save({ session });
        destinationAccount.balance = Number(destinationAccount.balance.toFixed(2)) - destinationAmount;
        /* if (type === constants.TransactionType.TRANSFER) {
          destinationAccount.balance = Number(destinationAccount.balance.toFixed(2)) + destinationAmount;
        }
        else if (type === constants.TransactionType.CREDIT) {
          if (isDenstinationAccount) {
            destinationAccount.balance = Number(destinationAccount.balance.toFixed(2)) + destinationAmount;
          }
        }
        else if (type === constants.TransactionType.DEBIT) {
          if (isDenstinationAccount) {
            destinationAccount.balance = Number(destinationAccount.balance.toFixed(2)) + destinationAmount;
            destinationAccount.balance = Number(destinationAccount.balance.toFixed(2))
          }
        }
        else {
          await session.abortTransaction();
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(destination, `Transaction Source not valid to transaction type`, 'source', "DB.ClubAccount")).validationResult.errors }));
        } */
        if (isNaN(destinationAccount.balance)) {
          throw new Error('Destination: The new balance is not a number!');
        }
        await destinationAccount.save({ session })


        /* await Order.findByIdAndUpdate(order,{status: constants.OrderStatus.CLOSE},{session})
         */
        await session.commitTransaction();
        const savedCA = await ClubAccount.find().populate('transactions')
        log.info("savedCA", savedCA)

        return res.status(201).json({ success: true, errors: ["add_transaction success"], data: [] })
      }
      catch (error) {
        await session.abortTransaction();
        return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.EXCEPTION", { name: "EXCEPTION", error }));
      }
      finally {

        await session.endSession();
      }

    }
    catch (error) {
      return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]

exports.add_transaction_payment = [
  body('source._id').isLength({ min: 4 }).withMessage("source must at lease 4 characters"),
  body('source.accountType').isLength({ min: 6, max: 6 }).withMessage("must be valid"),
  body('destination._id').isLength({ min: 4 }).withMessage("destination must at least 4 characters"),
  body('destination.accountType').isLength({ min: 4, max: 6 }).withMessage("must be valid"),
  body('amount', "Must be number").isNumeric(),
  body('type').isLength({ min: 1 }),
  body('order._id').isLength({ min: 0, max: 24 }).withMessage("order._id must be max 24 characters"),
  body('order.type').isLength({ min: 1 }).withMessage("order.type must valid"),

  async (req, res, next) => {
    try {
      let { source, destination, amount, order, description, payment, type } = req.body;
      type = type.toUpperCase();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUBACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "ExpressValidator", errors }));
      }

      /* Transaction */
      const session = await mongoose.startSession();
      try {
        session.startTransaction();
        if (order.type.referance == constants.OrderTypeReferance.Expense) {
          const expense = await Expense.findById(order._id).exec();
          if (expense) {
            expense.status = constants.OrderStatus.CLOSE;
            await expense.save({ session });
          }
          else {
            await session.abortTransaction();
            return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(order._id, `Expense not found`, 'order._id', "DB.ClubAccount")).validationResult.errors }));
          }
        }
        /* const transactionResult = await session.withTransaction(async () => { */
        var sourceAccount;
        var destinationAccount;

        let isSourceBank = source.accountType == constants.EAccountType.BANK;
        let isDenstinationBank = destination.accountType == constants.EAccountType.BANK;
        let isSourceAccount = source.accountType == constants.EAccountType.MEMBER || source.accountType == constants.EAccountType.SUPPLIERS;
        let isDenstinationAccount = destination.accountType == constants.EAccountType.MEMBER || destination.accountType == constants.EAccountType.SUPPLIERS;
        if (isSourceBank) {
          sourceAccount = await ClubAccount.findOne({ account_id: source._id }).exec();
        }
        else if (isSourceAccount)
          sourceAccount = await Account.findOne({ account_id: source._id }).populate('member');
        else {
          await session.abortTransaction();
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(source._id, `Account not found`, 'source', "DB.ClubAccount")).validationResult.errors }));
        }
        if (isDenstinationBank) {
          destinationAccount = await ClubAccount.findOne({ account_id: destination._id });
        } else if (isDenstinationAccount) {
          destinationAccount = await Account.findOne({ account_id: destination._id }).populate('member');
        } else {
          await session.abortTransaction();
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(destination._id, `Account not found`, 'destination', "DB.ClubAccount")).validationResult.errors }));
        }
        log.info("sourceAccount", sourceAccount);
        log.info("destinationAccount", destinationAccount)


        if (!sourceAccount) {
          await session.abortTransaction();
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(source, `Account not found`, 'source', "DB.ClubAccount")).validationResult.errors }));
        }

        if (!destinationAccount) {
          await session.abortTransaction();
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(destination, `Account not found`, 'destination', "DB.ClubAccount")).validationResult.errors }));
        }

        const tSource = getTranctionName(source, sourceAccount);
        log.info("tSource", tSource)
        const tDestination = getTranctionName(destination, destinationAccount);
        log.info("tDestination", tDestination)
        let sourceAmount = 0;
        let destinationAmount = 0;
        if (type == constants.TransactionType.CREDIT) {
          sourceAmount = Number(Number(-amount).toFixed(2));
          destinationAmount = sourceAmount
        }
        else if (type == constants.TransactionType.DEBIT) {
          sourceAmount = Number(Number(amount).toFixed(2));
          destinationAmount = sourceAmount
        }
        else {
          await session.abortTransaction();
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(type, `Transaction Type`, 'type', "DB.ClubAccount")).validationResult.errors }));
        }

        const sourceTransaction = new Transaction({
          source: tSource,
          destination: tDestination,
          amount: sourceAmount,
          source_balance: Number(sourceAccount.balance.toFixed(2)),
          destination_balance: Number(destinationAccount.balance.toFixed(2)),
          type: type,
          calculation_type: constants.CalcType.AMOUNT,
          date: source.date,
          description: description,
          payment: payment,
          order: order
        });

        sourceAccount.balance = Number(sourceAccount.balance.toFixed(2)) + sourceAmount;
        if (isNaN(sourceAccount.balance)) {
          throw new Error('Source: The new balance is not a number!');
        }

        sourceAccount.transactions.push(sourceTransaction);
        await sourceAccount.save({ session })
        await sourceTransaction.save({ session });

        /*         const destinationTransaction = new Transaction({
                  source: tDestination ,
                  destination: tSource ,
                  amount: destinationAmount,
                  balance: Number(destinationAccount.balance.toFixed(2)),
                  type: type,
                  calculation_type: constants.CalcType.AMOUNT,
                  date: source.date,
                  description: description,
                  payment: payment,
                  order: order
                }); 
        
                destinationAccount.transactions.push(destinationTransaction);*/
        destinationAccount.transactions.push(sourceTransaction);
        /*  await destinationTransaction.save({ session }); */
        destinationAccount.balance = Number(destinationAccount.balance.toFixed(2)) + destinationAmount;
        /* if (type === constants.TransactionType.TRANSFER) {
          destinationAccount.balance = Number(destinationAccount.balance.toFixed(2)) + destinationAmount;
        }
        else if (type === constants.TransactionType.CREDIT) {
          if (isDenstinationAccount) {
            destinationAccount.balance = Number(destinationAccount.balance.toFixed(2)) + destinationAmount;
          }
        }
        else if (type === constants.TransactionType.DEBIT) {
          if (isDenstinationAccount) {
            destinationAccount.balance = Number(destinationAccount.balance.toFixed(2)) + destinationAmount;
            destinationAccount.balance = Number(destinationAccount.balance.toFixed(2))
          }
        }
        else {
          await session.abortTransaction();
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(destination, `Transaction Source not valid to transaction type`, 'source', "DB.ClubAccount")).validationResult.errors }));
        } */
        if (isNaN(destinationAccount.balance)) {
          throw new Error('Destination: The new balance is not a number!');
        }
        await destinationAccount.save({ session })


        /* await Order.findByIdAndUpdate(order,{status: constants.OrderStatus.CLOSE},{session})
         */
        await session.commitTransaction();
        const savedCA = await ClubAccount.find().populate('transactions')
        log.info("savedCA", savedCA)

        return res.status(201).json({ success: true, errors: ["add_transaction success"], data: [] })
      }
      catch (error) {
        await session.abortTransaction();
        return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.EXCEPTION", { name: "EXCEPTION", error }));
      }
      finally {

        await session.endSession();
      }

    }
    catch (error) {
      return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]

exports.delete_expense = [
  param('_id').isLength({ min: 24, max: 24 }).withMessage("_id must be 24 characters"),
  async (req, res, next) => {
    try {
      let { _id } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUBACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "ExpressValidator", errors }));
      }

      /* Transaction */
      const session = await mongoose.startSession();
      try {
        session.startTransaction();
        const expense = await Expense.findByIdAndDelete(_id).exec();

        if (!expense) {

          await session.abortTransaction();
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(_id, `Expense not found`, '_id', "DB.ClubAccount")).validationResult.errors }));
        }


        await session.commitTransaction();

        return res.status(201).json({ success: true, errors: ["add_transaction success"], data: [] })
      }
      catch (error) {
        await session.abortTransaction();
        return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.EXCEPTION", { name: "EXCEPTION", error }));
      }
      finally {

        await session.endSession();
      }

    }
    catch (error) {
      return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]
exports.list_expense = [
  async (req, res, next) => {
    let { filter } = req.body;
    if (filter === undefined) filter = {};
    try {
      const results = await Expense.find(filter).exec();
      if (results) {
        return res.status(201).json({ success: true, data: results });
      }
      return next(new ApplicationError("add_account", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_ACCOUNT.VALIDATION", { name: "Validator", errors: (new CValidationError("*", "Expense Not Exist", '', "DB")).validationResult.errors }));
    }
    catch (error) {
      return next(new ApplicationError("club_create", 400, "CONTROLLER.CLUB.CLUB_CREATE.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]

exports.create_expense = [
  async (req, res, next) => {

    try {

      let { filter, update } = req.body;
      if (filter === undefined) filter = {};
      if (update === undefined) update = {};

      const results = await Expense.insertMany([update]);
      if (results) {
        return res.status(201).json({ success: true, data: results });
      }
      return next(new ApplicationError("create_expense", 400, "CONTROLLER.CLUB_ACCOUNT.CREATE_EXPENSE.VALIDATION", { name: "Validator", errors: (new CValidationError("*", "Expense Not Exist", '', "DB")).validationResult.errors }));
    }
    catch (error) {
      return next(new ApplicationError("create_expense", 400, "CONTROLLER.CLUB.CREATE_EXPENSE.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]
exports.update_expense = [
  async (req, res, next) => {

    try {
      let { filter, update } = req.body;
      if (filter === undefined) filter = {};
      if (update === undefined) update = {};

      const results = await Expense.findByIdAndUpdate(update._id, update);
      if (results) {
        return res.status(201).json({ success: true, data: results });
      }
      return next(new ApplicationError("update_expense", 400, "CONTROLLER.CLUB_ACCOUNT.UPDATE_EXPENSE.VALIDATION", { name: "Validator", errors: (new CValidationError("*", "Expense Not Exist", '', "DB")).validationResult.errors }));
    }
    catch (error) {
      return next(new ApplicationError("update_expense", 400, "CONTROLLER.CLUB.UPDATE_EXPENSE.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]

exports.list_transaction = [
  async (req, res, next) => {

    try {
      let from = new Date(req.query.from);
      let to = new Date(req.query.to);
      let filter = { date: { $gte: from, $lte: to } };
      if (isNaN(from) || isNaN(to)) {
        filter = {}
      }

      const results = await Transaction.find(filter);
      if (results) {
        return res.status(201).json({ success: true, data: results });
      }
      return next(new ApplicationError("transaction_list", 400, "CONTROLLER.CLUB_ACCOUNT.TRANSACTION_LIST.VALIDATION", { name: "Validator", errors: (new CValidationError("*", "Expense Not Exist", '', "DB")).validationResult.errors }));
    }
    catch (error) {
      return next(new ApplicationError("transaction_list", 400, "CONTROLLER.CLUB.TRANSACTION_LIST.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }

]

exports.list_account_saving = [
  query('_id').isLength({ min: 24, max: 24 }).withMessage(" club _id must be  24 characters"),
  async (req, res, next) => {
    let { _id } = req.query;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUBACCOUNT.RESERV_LIST.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const results = await ClubAccount.findOne({ "_id": _id }).select("account_saving club balance");
      if (results) {
        return res.status(201).json({ success: true, data: results });
      }
      return next(new ApplicationError("transaction_list", 400, "CONTROLLER.CLUB_ACCOUNT.RESERVE_LIST.VALIDATION", { name: "Validator", errors: (new CValidationError("*", "Reserve Not Exist", '', "DB")).validationResult.errors }));
    }
    catch (error) {
      return next(new ApplicationError("transaction_list", 400, "CONTROLLER.CLUB.RESERVE_LIST.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }

]
exports.account_saving_update = [
  body('reserve_id').isLength({ min: 1 }).withMessage("reserve_id must be supply"),
  async (req, res, next) => {

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUBACCOUNT.RESERV_UPDATE.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const results = await ClubAccount.findOne({ "reserve.id": req.body.reserve_id }).select("balance account_saving club");
      if (results) {
        results.account_saving[0].balance = req.body.new_balance
        /* console.log("newResult",req.body.new_balance , results.reserve[0].balance) */
        const saveResult = await results.save()
        return res.status(201).json({ success: true, data: saveResult });
      }
      return next(new ApplicationError("transaction_list", 400, "CONTROLLER.CLUB_ACCOUNT.RESERVE_UPDATE.VALIDATION", { name: "Validator", errors: (new CValidationError("*", "Reserve Not Exist", '', "DB")).validationResult.errors }));
    }
    catch (error) {
      return next(new ApplicationError("transaction_list", 400, "CONTROLLER.CLUB.RESERVE_UPDATE.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }

]
async function writeDumpFile(path, contents) {
  try {
    const dir = fs.mkdirSync(getDirName(path), { recursive: true })
    fs.writeFileSync(path, contents);

  }
  catch (error) {
    console.error("WriteFile error", error)
  }
}
const  writeFilePromiss =  (filePath, fileContent) => {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(filePath,fileContent)
      
      if(exist)
        resolve(exist);
      else
      reject("Failed")

      /* fs.mkdirSync(filePath, { recursive: true })  */
      /* fs.writeFile(filePath, fileContent,(err) => {
        if(err){
          reject(err);    
        }
        const exist = fs.existsSync(filePath)
        resolve(exist);

      })*/
      
    }
    catch (err) {
      reject(err);
    } 
  });
}
function writeAuthFile(data, success, fail) {
  var fs = require('fs');
  fs.writeFile('auth.json', JSON.stringify(data), function(error) {
    if(error) { 
      console.log('[write auth]: ' + err);
        if (fail)
          fail(error);
    } else {
      console.log('[write auth]: success');
        if (success)
          success();
    }
  });
}
exports.dump_club_account = [
  async (req,res,next) => {
    try{
      /* const results = await Transaction.find(); */
      const club = await ClubAccount.find().populate('accounts');
      const path = process.cwd() + `\\transaction_PPP${new Date().getFSDate()}.json`
/*       const writePromiss = writeFilePromiss(path, JSON.stringify(results)).then((value) => {
        console.log("WriteFile value")
        return res.status(201).json({ success: true, count: results.length, data: results });
      })
      .catch((err) => {
        console.error("WriteFile error", err)
        return next(new ApplicationError("dump_club_account", 400, "CONTROLLER.CLUB.dump_club_account.EXCEPTION", { name: "EXCEPTION", err }));
      }) */
      await writeDumpFile(path,JSON.stringify(club)) 
      /* await writeDumpFile(path,JSON.stringify(results))
      await writeDumpFile(path,JSON.stringify(club))  */ 
      /* writeAuthFile({yossi: "yoss"},path,true) */
      /* return res.status(201).json({ success: true, count: results.length, data: results }); */
      return res.status(201);
    }
    catch(error){
      return next(new ApplicationError("dump_club_account", 400, "CONTROLLER.CLUB.dump_club_account.EXCEPTION", { name: "EXCEPTION", error }));
    }finally{
      return res.status(201).json({ success: true, count: results.length, data: results });
    }

  }
]
exports.convert_transaction = [
  async (req, res, next) => {

    try {
      const results = await Transaction.find();
      try {
        if (results) {
          const transacation = results.filter((item) => item.calculation_type.toUpperCase() == constants.CalcType.TRANSACTION.toUpperCase());
          const converted =  transacation.map((item,index) => {
            if(item.calculation_type.toUpperCase() == constants.CalcType.TRANSACTION.toUpperCase())
            {
              console.error("item.calculation_type.toUpperCase()", item.calculation_type.toUpperCase(),index)
            }  
            if (item.destination == "BAZ/HAIFA/BC001001") {
                const dest = item.source;
                item.source = item.destination;
                item.destination = dest
              }
              if (item.order.type.toUpperCase() == "OTHER" || item.order.type.toUpperCase() == "ORDER" || item.order.type.toUpperCase() == "Expense".toUpperCase()) {
                item.payment.method = "NONE";
                if ((item._id == "6574af4e71386a12e5677f4c" || item._id == "6574af2d71386a12e5677cfc") && item.order.type.toUpperCase() == "Expense".toUpperCase()) {
                  item.type = constants.TransactionType.DEBIT
                }

                if (item.type.toUpperCase() == "DEBIT") {
                  item.amount = Math.abs(item.amount)
                }
                if (item.type.toUpperCase() == "CREDIT") {
                  item.amount = -Math.abs(item.amount)
                }
              }
              else if (item.payment.method.toUpperCase() == "Transfer".toUpperCase()) {

                item.type = "DEBIT"
                item.amount = Math.abs(item.amount)
              }
              item.calculation_type = "AMOUNT";
              return item
            })
                  /* const docs = converted._doc.toObject() */
                  await Transaction.bulkWrite(converted.map(doc => ({
                    
                    updateOne:{
                      filter: {_id: doc.toObject()._id},
                      update:doc.toObject(),
                      upsert: true
                    }
                  })))  
          return res.status(201).json({ success: true, count: {original: transacation.length, converted: converted.length }, data: {original: transacation, converted: converted }});
        }
      }
      catch (error) {
        console.error("WriteFile error", error)
        return next(new ApplicationError("transaction_list", 400, "CONTROLLER.CLUB.TRANSACTION_LIST.EXCEPTION", { name: "EXCEPTION", error }));
      }

      return next(new ApplicationError("transaction_list", 400, "CONTROLLER.CLUB_ACCOUNT.TRANSACTION_LIST.VALIDATION", { name: "Validator", errors: (new CValidationError("*", "Expense Not Exist", '', "DB")).validationResult.errors }));
    }
    catch (error) {
      return next(new ApplicationError("transaction_list", 400, "CONTROLLER.CLUB.TRANSACTION_LIST.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }

]
