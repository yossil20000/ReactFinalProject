const log = require('debug-level').log('ClubAccountController');
const { body, param, validationResult } = require('express-validator');
const ClubAccount = require('../Models/clubAccount');
const { ApplicationError } = require('../middleware/baseErrors');
const { CValidationError } = require('../Utils/CValidationError');

const Account = require('../Models/account');


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
        desctiption: req.body.desctiption === undefined ? "" : req.body.desctiption
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
    ClubAccount.findById(req?.body?.filter === undefined ? {} : req.body.filter, req.body.find_select === undefined ? {} : req.body.find_select)
    .select("accounts _id  club")  
    .populate({path: "accounts",model: "Account",select:{ "_id": 1, "account_id" : 1}
      ,populate:[{
        path: 'member',
        model: "Member",
        select: {"_id" : 1, "family_name": 1,"member_id":1}
      }] })
      

      .exec(function (err, list_members) {
        if (err) { return next(err); }
        res.status(201).json({ success: true, errors: [], data: list_members });
      })
  }
  catch (error) {
    return next(new ApplicationError("combo", 400, "CONTROLLER.MEMBER.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
  }
}