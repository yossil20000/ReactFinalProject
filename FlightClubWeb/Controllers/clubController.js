const Club = require('../Models/Club');
const { account } = require('./accountController');

const log = require('debug-level').log('ClubController');
exports.club = async function (req, res, next) {
  log.info("club");
  try {
    const club = await Club.find().populate('club_accounts').exec();
    if (club) {
      return res.status(201).json({ success: true, errors: [err], data: club });
    }
    return res.status(400).json({ success: false, errors: ["club not exist"], data: [] });

  }
  catch (error) {
    log.info(err);
    return res.status(501).json({ success: false, errors: [error], data: [] });
  }
}

exports.club_create = [
  body('_id').isLength({ min: 24, max:24 }).withMessage("_id must be 24 characters"),
  param('member_id').isLength({ min: 24, max:24 }).withMessage("_id must be 24 characters"),
  async (req, res, next) => {

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return next(new ApplicationError("club_create",400,"CONTROLLER.CLUB.CREATE.VALIDATION",{name: "ExpressValidator", errors}));
      }
      account = new account({
        account_id: "CA000001",
        member: req.body.member_id,
        balance: 0,
        desctiption: ""
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