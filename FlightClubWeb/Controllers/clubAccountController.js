const mongoose = require('mongoose');
const log = require('debug-level').log('ClubAccountController');
const { body, param, validationResult } = require('express-validator');
const ClubAccount = require('../Models/clubAccount');
const Order = require('../Models/order');
const {Account} = require('../Models/account');
const {Transaction,TransactionSchema} = require('../Models/transaction')
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
  log.info("club");
  try {
    const clubAccount = await ClubAccount.find().populate('accounts contact').exec();
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
          select: { "_id": 1, "family_name": 1, "member_id": 1 ,"member_type": 1}
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
const getTranctionName = (source, sourceTransaction) => {
  if(source.accountType === '100100'){
    return `${sourceTransaction.club.brand}/${sourceTransaction.club.branch}/${sourceTransaction.club.account_id}`
  }
  else if(source.accountType === '200200') {
    return `${sourceTransaction.member.member_id}/${sourceTransaction.member.family_name}/${sourceTransaction.account_id}`
  }
}
exports.add_transaction = [
  body('source._id').isLength({ min: 0, max: 24 }).withMessage("source must be 24 characters"),
  body('source.accountType').isLength({ min: 6, max: 6 }).withMessage("must be valid"),
   body('destination._id').isLength({ min: 24, max: 24 }).withMessage("destination must be 24 characters"),
  body('destination.accountType').isLength({ min: 6, max: 6 }).withMessage("must be valid"),
  body('amount', "Must be number").isNumeric(),
  body('order').isLength({ min: 24, max: 24 }).withMessage("order must be 24 characters"),
  async (req, res, next) => {
    try {
     
      let { source, destination, amount, order, description } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUBACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const orderDoc = await Order.findById(order).select("member").lean().exec();
      const account =  await Account.findOne({"member": orderDoc.member}).lean().exec();
      log.info("Find member",orderDoc);
    
    
      log.info("Find member",orderDoc.member);
      
      const {member} = orderDoc;
      
      
      log.info("Find member/memberId.member",member);
    
     

      
      if(source._id === "")
      {
        if(!account || account === undefined){
          return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(source._id, `Account not found`, 'source', "DB.ClubAccount")).validationResult.errors }));
        }
        source._id = account["_id"].toString();
      }
      
      /* Transaction */
      const session = await mongoose.startSession();
      try {
        session.startTransaction();

        /* const transactionResult = await session.withTransaction(async () => { */
          var sourceTransaction;
          var destinationTransaction;
          if (source.accountType == "100100")
            sourceTransaction = await ClubAccount.findById({_id : source._id}).exec();
          else if (source.accountType == "200200")
            sourceTransaction = await Account.findById({_id: source._id}).populate('member');
          else{
            await session.abortTransaction();
            return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(source._id, `Account not found`, 'source', "DB.ClubAccount")).validationResult.errors }));
          }
          if(destination.accountType === "100100"){
            destinationTransaction = await ClubAccount.findById({_id: destination._id});
          }else if(destination.accountType === "200200"){
            destinationTransaction = await Account.findById({_id: destination._id}).populate('member');
          }else{
            await session.abortTransaction();
            return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(destination._id, `Account not found`, 'destination', "DB.ClubAccount")).validationResult.errors }));
          }
          log.info("sourceTransaction",sourceTransaction);
          log.info("destinationTransaction",destinationTransaction)
          const orderTransaction = await Order.findById({_id: order}).exec();


          if (!sourceTransaction) {
            await session.abortTransaction();
            return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(source, `Account not found`, 'source', "DB.ClubAccount")).validationResult.errors }));
          }

          if (!destinationTransaction) {
            await session.abortTransaction();
            return next(new ApplicationError("add_transaction", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(destination, `Account not found`, 'destination', "DB.ClubAccount")).validationResult.errors }));
          }

          if (!orderTransaction) {
            await session.abortTransaction();
            return next(new ApplicationError("add_account", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(order, `Order not found`, 'order', "DB.ClubAccount")).validationResult.errors }));
          }
          if(orderTransaction.status === constants.OrderStatus.CLOSE ){
            await session.abortTransaction();
            return next(new ApplicationError("add_account", 400, "CONTROLLER.CLUB_ACCOUNT.ADD_TRANSACTION.VALIDATION", { name: "Validator", errors: (new CValidationError(orderTransaction.status, `Order Status Already Closed`, 'order.status', "DB.ClubAccount")).validationResult.errors }));
          }

          const tSource = getTranctionName(source,sourceTransaction);
          log.info("tSource",tSource)
          const tDestination = getTranctionName(destination,destinationTransaction);
          log.info("tDestination",tDestination)
           
/*            let transactionS = new Transaction({
            source: tSource,
            destination: tDestination,
            amount: -amount,
            order: order,
            description: description
          });  
          let transactionD = new Transaction({
            source: tSource,
            destination: tDestination,
            amount: amount,
            order: order,
            description: description
          });   */
      sourceTransaction.transactions.push({source: tSource,
        destination: tDestination,
        amount: -amount,
        order: order,
        description: description})
     sourceTransaction.balance = Number(sourceTransaction.balance.toFixed(2)) -  Number(Number(amount).toFixed(2));
     
      if(isNaN(sourceTransaction.balance))
      {
        throw new Error('Source: The new balance is not a number!');
      }
      
      
      await sourceTransaction.save({session})

      destinationTransaction.transactions.push({source: tSource,
        destination: tDestination,
        amount: amount,
        order: order,
        description: description})
      destinationTransaction.balance = Number(destinationTransaction.balance.toFixed(2)) + Number(amount.toFixed(2));
      if(isNaN(destinationTransaction.balance))
      {
        throw new Error('Destination: The new balance is not a number!');
      }
      await destinationTransaction.save({session})
      
      await Order.findByIdAndUpdate(order,{status: constants.OrderStatus.CLOSE},{session})
      
         await session.commitTransaction();
         const savedCA = await ClubAccount.find().populate('transactions')
         console.log("savedCA",savedCA)
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

exports.list_expense = [ 
  async (req, res, next) => {
    let {filter} = req.body;
    if(filter === undefined) filter={};
    try {
    const results = await Expense.find(filter).exec();
    if(results){
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
    
      let {filter,update} = req.body;
      if(filter === undefined) filter={};
      if(update === undefined) update={};

    const results = await Expense.insertMany([update]);
    if(results){
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
      let {filter,update} = req.body;
      if(filter === undefined) filter={};
      if(update === undefined) update={};

    const results = await Expense.findByIdAndUpdate(update._id,update);
    if(results){
      return res.status(201).json({ success: true, data: results });
    }
    return next(new ApplicationError("update_expense", 400, "CONTROLLER.CLUB_ACCOUNT.UPDATE_EXPENSE.VALIDATION", { name: "Validator", errors: (new CValidationError("*", "Expense Not Exist", '', "DB")).validationResult.errors }));
    }
    catch (error) {
      return next(new ApplicationError("update_expense", 400, "CONTROLLER.CLUB.UPDATE_EXPENSE.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]

