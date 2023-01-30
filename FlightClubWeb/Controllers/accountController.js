const log = require('debug-level').log('AccountController');
const { body, param, validationResult } = require('express-validator');
const { ApplicationError } = require('../middleware/baseErrors');
const { findAccount } = require('../Services/accountService')
const Account = require('../Models/account');
const Member = require('../Models/member');
const async = require('async');
const { ResultWithContext } = require('express-validator/src/chain');
exports.account_list = [async function (req, res, next) {
  try {
    log.info('account_list/req', req.body);
    const { accounts } = await findAccount({});
    res.status(201).json({ success: true, errors: [], data: accounts });
    return;
  }
  catch (error) {
    return next(new ApplicationError("account_list", 400, "CONTROLLER.ACCOUNT.ACCOUT_LIST.EXCEPTION", { name: "EXCEPTION", error }));
  }
}
]
exports.account_search = [async function (req, res, next) {
  try {
    log.info('account_search/params', req.query);

    const { accounts } = await findAccount(req.query);
    res.status(201).json({ success: true, errors: [], data: accounts });
    return;
  }
  catch (error) {
    return next(new ApplicationError("account_search", 400, "CONTROLLER.ACCOUNT.ACCOUT_SEARCH.EXCEPTION", { name: "EXCEPTION", error }));
  }
}
]
exports.account = [
  param('_id').isLength({ min: 24, max: 24 }).withMessage("_id must be 24 characters"),
  async function (req, res, next) {
    try {
      log.info('account/params', req.params);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("account", 400, "CONTROLLER.ACCOUNT.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const account = await Account.findById(req.params._id).exec()

      res.status(201).json({ success: true, errors: [], data: account });
      return;

    }
    catch (error) {

      log.info('account/error_type', typeof error);

      return next(new ApplicationError("account", 400, "CONTROLLER.ACCOUNT.ACCOUT.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]

exports.account_create = [
  body('member_id').isLength({ min: 24, max: 24 }).withMessage("member_id must be 24 characters"),
  async (req, res, next) => {
    try {
      log.info('account_create/req', req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("account_create", 400, "CONTROLLER.ACCOUNT.CREATE.VALIDATION", { name: "ExpressValidator", errors }));
      }
      Member.findById(req.body.member_id ).exec((err, member) => {
        if (err) {
          log.info('account_create/err', err);
        }
        if (member === null) {
          return res.status(400).json({ success: false, errors: ["member not exist"], message: "member not exist", data: req.body.member_id });
        }
        const account_id = `BZ${member.member_id}`;
        Account.findOne({ $or: [{ 'member': req.body.member_id }, { 'account_id': account_id }] }).exec((err, account) => {
          if (err) {
            log.info('account_create/err', err);
          }
          if (account) {
            return res.status(400).json({ success: false, errors: ["account already exist"], message: "account already exist", data: account });
          }
          account = new Account({
            member: req.body.member_id,
            account_id: account_id
          })
          log.info('account_create/account', account);
          account.save((err, result) => {
            if (err) {
              return res.status(400).json({ success: false, errors: [err], message: "Failed To Save", data: account })
            }
            if (result) {
              console.log("account_create/Result", result);
              res.status(200).json({ success: true, errors: ["Account Create"], data: account })
              return;
            }
          })

        })
      })

    }
    catch (error) {
      return next(new ApplicationError("account_create", 400, "CONTROLLER.ACCOUNT.ACCOUNT_CREATE.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]

exports.combo = function (req, res, next) {
  try {
    log.info("combo/filter", req.body);
    Account.find(req?.body?.filter === undefined ? {} : req.body.filter, req.body.find_select === undefined ? {} : req.body.find_select)
      .populate({ path: "member", select: "member_id first_name family_name" })
      .select('account_id _id')
      .sort([['account_id', 'ascending']])
      .exec(function (err, list_members) {
        if (err) { return next(err); }
        res.status(201).json({ success: true, errors: [], data: list_members });
      })
  }
  catch (error) {
    return next(new ApplicationError("combo", 400, "CONTROLLER.MEMBER.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
  }
}
exports.account_update = [
  body("_id").isLength({ min: 24, max: 24 }).withMessage("_id must be 24 characters"),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("account_update", 400, "CONTROLLER.ACCOUNT.UPDATE.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const account = await Account.findByIdAndUpdate(req.body._id, {status: req.body.status,desctiption: req.body.desctiption}).exec();
      if (account) {
        return res.status(201).json({ success: true, errors: [], data: account })
      }
      return res.status(400).json({ success: false, errors: ["account update failed"], data: [] })

    }
    catch (error) {
      return next(new ApplicationError("account_update", 400, "CONTROLLER.ACCOUNT.ACCOUNT_UPDATE.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]
exports.account_delete = [
  body('_id').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id must be valid 24 characters'),
  body('member_id').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id must be valid 24 characters'),
  body('passcode').equals('force_delete').withMessage("Invalid passcode"),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("account_delete", 400, "CONTROLLER.ACCOUNT.DELETE.VALIDATION", { name: "ExpressValidator", errors }));
      }
      
    }
    catch (error) {
      return next(new ApplicationError("account_delete", 400, "CONTROLLER.ACCOUNT.ACCOUNT_DELETE.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]
exports.account_status = [
  body('_id').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id must be valid 24 characters'),
  body('status').trim().isLength({ min: 4 }).escape().withMessage('status must be valid'),
  function (req, res, next) {
    log.info(`account_status`, req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApplicationError("account_status", 400, "CONTROLLER.ACCOUNT.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
    }
    try {
      async.parallel({
        account: function (callback) {
          Account.updateOne({}, req.body, { runValidators: true }).exec(callback);
        }

      }, function (err, results) {
        if (err) { return res.status(400).json({ success: false, errors: [err], data: [] }); }
        if (results.account.acknowledged) {

          if (results.account.acknowledged == false) {
            return res.status(400).json({ success: false, errors: [err], data: [] });
          }
          else {
            return res.status(201).json({ success: true, errors: [], data: results });
          }

        }
      });
    }
    catch (error) {
      return next(new ApplicationError("account_status", 400, "CONTROLLER.ACCOUNT.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }]
exports.account_spare = [
  body(),
  async (req, res, next) => {
    try {

    }
    catch (error) {
      return next(new ApplicationError("account_create", 400, "CONTROLLER.ACCOUNT.ACCOUNT_CREATE.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]