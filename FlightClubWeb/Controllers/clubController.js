const Club = require('../Models/Club');

const log = require('debug-level').log('ClubController');
exports.club = async function (req, res, next) {
  log.info("club");
  try {
    const club = await Club.find().populate('clubAccoutn').exec();
    if(club){
      return res.status(201).json({ success: true, errors: [err], data: club});  
    }
    return res.status(401).json({ success: false, errors: ["club not exist"], data: [] });

  }
  catch (err) {
    log.info(err);
    return res.status(501).json({ success: false, errors: [err], data: [] });
  }
}