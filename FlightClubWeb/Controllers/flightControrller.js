const mongoose = require('mongoose');
const log = require('debug-level').log('flightController');
const { resSerializer } = require('debug-level/src/serializers');
const { body, validationResult } = require('express-validator');
const Flight = require('../Models/flight');
const Member = require('../Models/member');
const Device = require('../Models/device');
exports.flight = function (req, res, next) {
  log.info(`flight ${req.params._id}`)
  Flight.findOne({ _id: req.params._id }).
    populate('device').populate('member').
    exec((err, results) => {
      if (err) {
        return res.status(401).json({ success: false, errors: [err], data: [] })
      }
      else {
        return res.status(201).json({ success: true, errors: [], data: results })
      }
    });
};

exports.flight_list = function (req, res, next) {
  log.info('flight_list');
  Flight.find().populate('device').populate('member').
    exec((err, results) => {
      if (err) {
        log.info('flight_list', err);
        return res.status(401).json({ success: false, errors: [err], data: [] })
      }
      else {
        log.info('flight_list', results);
        return res.status(201).json({ success: true, errors: [], data: results })
      }
    })
}

exports.flight_create = [
  body('device_id').trim().isLength({ min: 1 }).escape().withMessage('device_id must be valid'),
  body('member_id').trim().isLength({ min: 1 }).escape().withMessage('member_id must be valid'),
  body('hobbs_stop', "Value must be greater then zero").trim().toInt().custom((value) => {
    if (Number(value) < 0) return false;
    return true;
  }),
  body('hobbs_start', "Value must be greater then zero").trim().toInt().custom((value) => {
    if (Number(value) < 0) return false;
    return true;
  }),
  body('hobbs_start', "Value must be less then hobbs_stop").trim().custom((value, { req }) => {
    if (Number(value) <= Number(req.body.hobbs_stop)) return true;
    return false;
  }),
  body('engien_start', "Value must be greater then zero").trim().toInt().custom((value) => {
    if (Number(value) < 0) return false;
    return true;
  }),
  body('engien_stop', "Value must be greater then zero").trim().toInt().custom((value) => {
    if (Number(value) < 0) return false;
    return true;
  }),
  body('engien_start', "Value must be less then hobbs_stop").trim().custom((value, { req }) => {
    if (Number(value) <= Number(req.body.engien_stop)) return true;
    return false;
  }),
  body('date_from', 'Invalid date_from').trim().isISO8601().toDate(),
  body('date_to', 'Invalid date_to').trim().isISO8601().toDate(),
  body('date_to', 'date_to must be greater then date_from').trim().isISO8601().toDate()
    .custom((value, { req }) => {
      if ((value - req.body.date_from) > 0) return true;
      return false;
    }),
    async  (req, res, next) => {
      try {
        
        const errors =  validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(401).json({ success: false, errors: [errors], data: req.body });
        }
        const member = await Member.findById(req.body.member_id).exec();
       //log.info("flight/find/member",member,req.body.member_id)
        if (member === null | member === undefined) {
          return res.status(401).json({ success: false, errors: ["Member Not Exist"], data: [] })
        }
        const device = await Device.findById(req.body.device_id ).exec();
        if (device === null | device === undefined) {
          return res.status(401).json({ success: false, errors: ["Device Not Exist"], data: [] })
        }
        let newFlight = new Flight({
          date_from: req.body.date_from,
          date_to: req.body.date_to,
          member: member,
          device: device,
          hobbs_start: req.body.hobbs_start,
          hobbs_stop: req.body.hobbs_stop,
          engien_start: req.body.engien_start,
          engien_stop: req.body.engien_stop
        })
        log.info("newReservation", newFlight._doc);
        const found = await Flight.findOne({
          $and: [
            { device: newFlight._doc.device },
            {
              $or: [
                { $and: [{ hobbs_start: { $lte: newFlight._doc.hobbs_stop } }, { hobbs_stop: { $gte: newFlight._doc.hobbs_stop } }] },
                { $and: [{ hobbs_start: { $lte: newFlight._doc.hobbs_start } }, { hobbs_stop: { $gte: newFlight._doc.hobbs_start } }] },
                { $and: [{ engien_start: { $lte: newFlight._doc.engien_stop } }, { engien_stop: { $gte: newFlight._doc.engien_stop } }] },
                { $and: [{ engien_start: { $lte: newFlight._doc.engien_start } }, { engien_stop: { $gte: newFlight._doc.engien_start } }] }
              ]
            }
          ]
        }).exec();
    
        if (found?._doc === undefined) {
          const session = await mongoose.startSession();
          const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
          };
          try {
            const trananctionResult = await session.withTransaction(async () => {
              const flightSaveResult = await Flight.insertMany([newFlight._doc], { session: session });
              log.info("flightSaveResult/Flight/Create", flightSaveResult);
              const deviceUpdate = await Device.updateOne({_id:req.body.device_id},{$addToSet: {flights: newFlight._doc}},{session});
              log.info("flightSaveResult/Device.updateOne", deviceUpdate);
              const memeberUpdate = await Member.updateOne({_id:req.body.member_id},{$addToSet: {flights: newFlight._doc}},{session});
              log.info("flightSaveResult/Member.updateOne", memeberUpdate);
              if(memeberUpdate.acknowledged == false || deviceUpdate.acknowledged == false){
                await session.abortTransaction();
                log.info("trananctionResult/flight created aborted due to Devie/Member update failed");
                return res.status(401).json({ success: false, errors: ["Flight created aborted due to Devie/Member update failed"], data: [] })
              }
            }, transactionOptions);
            if (trananctionResult) {
              log.info("trananctionResult/flight created succefully",trananctionResult);
              return res.status(201).json({ success: true, errors: ["Flight transacon success"], data: [] })
            }
            else {
              log.info("trananctionResult/flight created intentionally aborted");
            }
          }
          catch (error) {
            log.info("trananctionResult/flight error", error);
          }
          finally {
            await session.endSession();
          }
          
        }
        else {
          log.info("found?._doc",found?._doc)
          return res.status(401).json({ success: false, errors: ["Flight Already exist"], data: [] })
        }
    
      }
      catch (error) {
        return res.status(501).json({ success: false, errors: [error], data: [] })
      }
    }
]

async function createFlight(newFlight, member, device) {
  const session = await mongoose.startSession();
  try {
    const trananctionResult = await session.withTransaction(async () => {
      const flightSaveResult = await newFlight.save()
    })
  }
  catch (error) {

  }
  finally {

  }
}