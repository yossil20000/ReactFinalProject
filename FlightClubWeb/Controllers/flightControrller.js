const mongoose = require('mongoose');
const { convertDecimal128ToNumber } = require('../Utils/mongooseTypeConverter');
const log = require('debug-level').log('flightController');
const { ApplicationError } = require('../middleware/baseErrors');
const { CValidationError } = require('../Utils/CValidationError');
const { body, validationResult } = require('express-validator');
const Flight = require('../Models/flight');
const Member = require('../Models/member');
const Device = require('../Models/device');
const { findFlights } = require('../Services/flightService');
const { findDevice } = require('../Services/deviceService');
const {getFlightQuery} = require('./Url2Mongoos');
const { device } = require('./deviceController');
const transactionOptions = {
  readPreference: 'primary',
  readConcern: { level: 'local' },
  writeConcern: { w: 'majority' }
};
exports.flight = function (req, res, next) {
  log.info(`flight ${req.params._id}`)

  Flight.findOne({ _id: req.params._id }).
    populate('device').populate('member').populate('member.membership')
    .exec((err, results) => {
      if (err) {
        return res.status(400).json({ success: false, errors: [err], data: [] })
      }
      else {
        return res.status(201).json({ success: true, errors: [], data: results })
      }
    });
};

exports.flight_list = function (req, res, next) {
  log.info('flight_list');
  let from = new Date(req.query.from);
  let to = new Date(req.query.to);
  let filter = { date: { $gte: from, $lte: to } };
  if (isNaN(from) || isNaN(to)) {
    filter = {}
  }
  Flight.find(filter).populate({ path: 'device',model: "Device", select: 'device_id _id' }).populate('member').
    exec((err, results) => {
      if (err) {
        log.info('flight_list', err);
        return res.status(400).json({ success: false, errors: [err], data: [] })
      }
      else {
        log.info('flight_list/results.byteLenght', Buffer.byteLength(JSON.stringify(results)));
        return res.status(201).json({ success: true, errors: [], data: results })
      }
    })
}
exports.flight_search = [async function (req, res, next) {
  try {
    log.info('flight_search/params', req.query);
    const filter= getFlightQuery(req.query)
    const { flights } = await findFlights(filter);
    res.status(201).json({ success: true, errors: [], data: flights });
    return;
  }
  catch (error) {
    return next(new ApplicationError("flight_search", 400, "CONTROLLER.FLIGHT.FLIGHT_SEARCH.EXCEPTION", { name: "EXCEPTION", error }));
  }
}
]
exports.flight_update = [
  body('_id').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id must be valid 24 characters'),
  body('hobbs_stop', "Value must be greater then zero").custom((value, { req }) => {
    if (!req.body.reuired_hobbs) return true;
    if (Number(value) < 0) return false;
    return true;
  }),
  body('hobbs_start', "Value must be greater then zero").custom((value, { req }) => {
    if (!req.body.reuired_hobbs) return true;
    if (Number(value) < 0) return false;
    return true;
  }),
  body('hobbs_start', "Value must be less then hobbs_stop").custom((value, { req }) => {
    if (!req.body.reuired_hobbs) return true;
    if (Number(value) < Number(req.body.hobbs_stop)) return true;
    return false;
  }),
  body('engien_start', "Value must be greater then zero").custom((value) => {
    if (Number(value) < 0) return false;
    return true;
  }),
  body('engien_stop', "Value must be greater then zero").custom((value) => {
    if (Number(value) < 0) return false;
    return true;
  }),
  body('engien_start', "Value must be less then hobbs_stop").custom((value, { req }) => {
    if (Number(value) < Number(req.body.engien_stop)) return true;
    return false;
  }),
  body('date', 'Invalid date').isISO8601(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("flight_update", 400, "CONTROLLER.FLIGHT.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
      }

      const flightToUpdate = await Flight.findById(req.body._id).exec();
      if (flightToUpdate == null) {
        return res.status(400).json({ success: false, errors: ["Flight not exist"], data: [] })
      }


      let updateFlight = {
        date: req.body.date,
        hobbs_start: req.body.hobbs_start,
        hobbs_stop: req.body.hobbs_stop,
        engien_start: req.body.engien_start,
        engien_stop: req.body.engien_stop,
        description: req.body.description === undefined ? flightToUpdate.description : req.body.description,
        reuired_hobbs: req.body.reuired_hobbs,
        duration: req.body.duration,
        flight_time: req.body.flight_time,
        fuel_start: req.body.fuel_start,
        oil_added: req.body.oil_added,
        timeOffset: Number((new Date(req.body.date)).getTimezoneOffset()),
      }
      log.info("updateFlight", updateFlight);

      let flightValid = false;
      if (req.body.reuired_hobbs) {
         flightValid = await isFlightValid(flightToUpdate.device._id, req.body); }
      else {
        flightValid = await isEngienValid(flightToUpdate.device._id, req.body);}

      if (flightValid) {
        const session = await mongoose.startSession();

        try {
         
          const trananctionResult = await session.withTransaction(async () => {
            const flightSaveResult = await Flight.updateOne({ _id: flightToUpdate._id }, updateFlight, { session: session });
            log.info("flightSaveResult/Flight/Update", flightSaveResult);
            
            if (flightSaveResult.acknowledged == false) {
              await session.abortTransaction();
              log.info("trananctionResult/flight update aborted due to Devie/Member update failed");
              return res.status(400).json({ success: false, errors: ["Flight update aborted due to Devie update failed"], data: [] })
            }
          }, transactionOptions);
          await session.commitTransaction();
          const maxValues = await deviceMaxValues(flightToUpdate.device._id);
          const hobbs_meter = maxValues[0]?.max_hobbs_stop;
          const engien_meter = maxValues[0]?.max_engien_stop;
          const deviceUpdate = await Device.updateOne({ _id: flightToUpdate.device._id }, { engien_meter: engien_meter, hobbs_meter: hobbs_meter }, { session });
          log.info("flightSaveResult/Device.updateOne", deviceUpdate);
          
          if (trananctionResult && deviceUpdate.acknowledged) {
            log.info("trananctionResult/flight update succefully", trananctionResult);
            return res.status(201).json({ success: true, errors: ["Flight update transacon success"], data: [] })
          }
          else {
            log.info("trananctionResult/flight update intentionally aborted");
            return res.status(400).json({ success: false, errors: ["Flight  update intentionally aborted"], data: [] })
          }
        }
        catch (error) {
          log.info("trananctionResult/flight/update error", error);
          return res.status(400).json({ success: false, errors: [error], data: [] })
        }
        finally {
          await session.endSession();
        }

      }
      else {

        return res.status(400).json({ success: false, errors: ["Flight Already exist"], data: [] })
      }

    }
    catch (error) {
      return next(new ApplicationError("flight_update", 400, "CONTROLLER.FLIGHT.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]

exports.flight_create = [
  body('_id_device').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id_device must be valid 24 characters'),
  body('_id_member').trim().isLength({ min: 24, max: 24 }).escape().withMessage('_id_member must be valid 24 characters'),
  body('hobbs_stop', "Value must be greater then zero").custom((value,{req}) => {
    if (!req.body.reuired_hobbs) return true;
    if (Number(value) < 0) return false;
    return true;
  }),
  body('hobbs_start', "Value must be greater then zero").custom((value,{req}) => {
    if (!req.body.reuired_hobbs) return true;
    if (Number(value) < 0) return false;
    return true;
  }),
  body('hobbs_start', "Value must be less then hobbs_stop").custom((value, { req }) => {
    if (!req.body.reuired_hobbs) return true;
    if (Number(value) < Number(req.body.hobbs_stop)) return true;
    return false;
  }),
  body('engien_start', "Value must be greater then zero").custom((value) => {
    if (Number(value) < 0) return false;
    return true;
  }),
  body('engien_stop', "Value must be greater then zero").custom((value) => {
    if (Number(value) < 0) return false;
    return true;
  }),
  body('engien_start', "Value must be less then engien_stop").custom((value, { req }) => {
    if (Number(value) < Number(req.body.engien_stop)) return true;
    return false;
  }),
  body('date', 'Invalid date').isISO8601(),
  async (req, res, next) => {
    try {

      log.info("flight_create", req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApplicationError("flight_create", 400, "CONTROLLER.FLIGHT.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const member = await Member.findById(req.body._id_member).exec();
      //log.info("flight/find/member",member,req.body._id_member)
      if (member === null | member === undefined) {
        return res.status(400).json({ success: false, errors: ["Member Not Exist"], data: [] })
      }
      const device = await Device.findById(req.body._id_device).exec();
      if (device === null | device === undefined) {
        return res.status(400).json({ success: false, errors: ["Device Not Exist"], data: [] })
      }

      const maxValues = await deviceMaxValues(req.body._id_device);
      let newFlight = new Flight({
        date: req.body.date,
        member: member,
        device: device,
        hobbs_start: req.body.hobbs_start,
        hobbs_stop: req.body.hobbs_stop,
        engien_start: req.body.engien_start,
        engien_stop: req.body.engien_stop,
        description: req.body.description,
        reuired_hobbs: req.body.reuired_hobbs,
        duration: req.body.duration,
        flight_time: req.body.flight_time,
        fuel_start: req.body.fuel_start,
        oil_added: req.body.oil_added,
        timeOffset: Number((new Date(req.body.date)).getTimezoneOffset()),
      })
      log.info("newReservation", newFlight._doc);

      let flightValid = false;
      if (req.body.reuired_hobbs) {
         flightValid = await isFlightValid(req.body._id_device, req.body); }
      else {
        flightValid = await isEngienValid(req.body._id_device, req.body);}
      if (flightValid) {
        const session = await mongoose.startSession();

        try {
          const trananctionResult = await session.withTransaction(async () => {
            const flightSaveResult = await Flight.insertMany([newFlight._doc], { session: session });
            log.info("flightSaveResult/Flight/Create", flightSaveResult);
            const hobbs_meter = (maxValues?.length == 0 || req.body.hobbs_stop > maxValues[0]?.max_hobbs_stop) ? req.body.hobbs_stop : maxValues[0].max_hobbs_stop;
            const engien_meter = (maxValues?.length == 0 || req.body.engien_stop > maxValues[0]?.max_engien_stop) ? req.body.engien_stop : maxValues[0].max_engien_stop;

            const deviceUpdate = await Device.updateOne({ _id: req.body._id_device }, { $addToSet: { flights: newFlight._doc }, engien_meter: engien_meter, hobbs_meter: hobbs_meter }, { session });

            log.info("flightSaveResult/Device.updateOne", deviceUpdate);
            const memeberUpdate = await Member.updateOne({ _id: req.body._id_member }, { $addToSet: { flights: newFlight._doc } }, { session });
            log.info("flightSaveResult/Member.updateOne", memeberUpdate);
            if (memeberUpdate.acknowledged == false || deviceUpdate.acknowledged == false) {
              await session.abortTransaction();
              log.info("trananctionResult/flight created aborted due to Devie/Member update failed");
              return res.status(400).json({ success: false, errors: ["Flight created aborted due to Devie/Member update failed"], data: [] })
            }
          }, transactionOptions);
          if (trananctionResult) {
            log.info("trananctionResult/flight created succefully", trananctionResult);
            return res.status(201).json({ success: true, errors: ["Flight create transacon success"], data: [] })
          }
          else {
            log.info("trananctionResult/flight created intentionally aborted");
            return res.status(400).json({ success: false, errors: ["Flight  create intentionally aborted"], data: [] })
          }
        }
        catch (error) {
          log.info("trananctionResult/flight error", error);
          return res.status(400).json({ success: false, errors: [error], data: [] })
        }
        finally {
          await session.endSession();
        }

      }
      else {
        log.info("Flight Already exist")
        return next(new ApplicationError("flight_create", 400, "CONTROLLER.FLIGHT.CREATE_FLIGHT.VALIDATION", { name: "Validator", errors: (new CValidationError(req.body.hobbs_start, `Flight ${req.body.engien_start} ${req.body.engien_stop} Already exist`, 'hobbs_start / hobbs_stop / engien_start / engien_stop', "DB.Fligth")).validationResult.errors }));
        
      }

    }
    catch (error) {
      return next(new ApplicationError("flight_create", 400, "CONTROLLER.FLIGHT.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
    }
  }
]


exports.flight_delete = [
  body("_id").trim().isLength({ min: 24, max: 24 }).withMessage("_id must be specified length 24"),
  async (req, res, next) => {
    const errors = validationResult(req);
    const session = await mongoose.startSession();
    try {
      if (!errors.isEmpty()) {
        return next(new ApplicationError("flight_delete", 400, "CONTROLLER.FLIGHT.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
      }
      const flight = await Flight.findById(req.body._id).exec();
      if (flight == null) {
        return res.status(400).json({ success: false, errors: ["Flight  delete Not exist"], data: [] })
      }
      
      const trananctionResult = await session.withTransaction(async () => {
        const flightDeleteResult = await Flight.deleteOne({ _id: req.body._id }, { session: session });
        if(flightDeleteResult.deletedCount == 0) {
          await session.abortTransaction();
          return res.status(400).json({ success: false, errors: ["Flight delete aborted due to Flight Delete failed"], data: [] })
        }
        const deviceUpdate = await Device.updateOne({ _id: flight.device._id }, { $pull: { flights: req.body._id } }, { session });
        const memberUpdate = await Member.updateOne({ _id: flight.member._id }, { $pull: { flights: req.body._id } }, { session });
        if (memberUpdate.acknowledged == false || deviceUpdate.acknowledged == false ) {
          await session.abortTransaction();
          log.info("trananctionResult/flight delete aborted due to Device / Member update failed");
          return res.status(400).json({ success: false, errors: ["Flight delete aborted due to Device/Member update failed"], data: [] })
        }
      }, transactionOptions);
      await session.commitTransaction();
        const maxValues = await deviceMaxValues(flight._doc.device._id);
      const hobbs_meter = maxValues[0]?.max_hobbs_stop;
      const engien_meter = maxValues[0]?.max_engien_stop;
      const deviceUpdateEngine = await Device.updateOne({ _id: flight.device._id }, { engien_meter: engien_meter, hobbs_meter: hobbs_meter }, { session });
      if(deviceUpdateEngine.acknowledged == false) {
        log.info("trananctionResult/device update engine_meter failed");
      }
      if (trananctionResult) {
        log.info("trananctionResult/flight delete succefully", trananctionResult);
        
        return res.status(201).json({ success: true, errors: ["Flight delete transacon success"], data: [] })
      }
      else {
        log.info("trananctionResult/flight delete intentionally aborted");
        return res.status(400).json({ success: false, errors: ["Flight  delete intentionally aborted"], data: [] })
      }

    }
    catch (error) {
      return next(new ApplicationError("flight_delete", 400, "CONTROLLER.FLIGHT.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
    }
    finally {
      await session.endSession();
    }
  }
]

const isFlightValid = async (_id, req) => {
  try {
    const found = await Flight.findOne({
      $and: [
        { device: _id },
        { _id: { $ne: req._id } },
        {
          $or: [
            { $and: [{ hobbs_start: { $lt: req.hobbs_stop } }, { hobbs_stop: { $gte: req.hobbs_stop } }] },
            { $and: [{ hobbs_start: { $lte: req.hobbs_start } }, { hobbs_stop: { $gt: req.hobbs_start } }] },
            { $and: [{ engien_start: { $lt: req.engien_stop } }, { engien_stop: { $gte: req.engien_stop } }] },
            { $and: [{ engien_start: { $lte: req.engien_start } }, { engien_stop: { $gt: req.engien_start } }] },
            { $and: [{ hobbs_start: req.hobbs_start }, { hobbs_stop: req.hobbs_stop }] },
            { $and: [{ engien_start: req.engien_start }, { engien_stop: req.engien_stop }] }
          ]
        }
      ]
    }).exec();
    log.info("isFlightValid/found", found?._doc)
    return found?._doc === undefined;
  }
  catch (error) {
    log.error("isFlightNotExist/exception: " + error)
    return false
  }

}
const isEngienValid = async (_id, req) => {
  try {
    const found = await Flight.findOne({
      $and: [
        { device: _id },
        { _id: { $ne: req._id } },
        {
          $or: [
            { $and: [{ engien_start: { $lt: req.engien_stop } }, { engien_stop: { $gte: req.engien_stop } }] },
            { $and: [{ engien_start: { $lte: req.engien_start } }, { engien_stop: { $gt: req.engien_start } }] },
            { $and: [{ engien_start: req.engien_start }, { engien_stop: req.engien_stop }] }
          ]
        }
      ]
    }).exec();

    return found?._doc === undefined;
  }
  catch (error) {
    log.error("isFlightNotExist/exception: " + error)
    return false
  }

}

const deviceMaxValuesWithStatus = async (_id, status = ["CLOSE"],from,to) => {
  if(_id instanceof mongoose.Types.ObjectId ) {
    _id = _id.toString();
  }
  const matchStage = {
       device: mongoose.Types.ObjectId(_id) ,
       status: { $in:status },
 
    };
          //engien_start: { $ne: null, $ne: "" },
       //engien_stop: { $ne: null, $ne: "" }
  //from = new Date(new Date().setFullYear(new Date().getFullYear()-1));
  //to =  new Date(new Date().setMonth(4));
  if(from && to){
    matchStage.date = {$gte: new Date(from),$lte: new Date(to) } //last year;
  }
/*   console.log("Match Stage:", matchStage);
const sample = await Flight.find(matchStage);
let max=0,min = 0
sample.map(flight => {
  const stop = Number(convertDecimal128ToNumber(flight.engien_stop));
  const start = Number(convertDecimal128ToNumber(flight.engien_start));
  if(stop > max) 
    max = stop;
  if(start < min || min === 0) 
    min = start;
});
console.log("Sample flights:", this.flight,max,min); */
  const maxValues = await Flight.aggregate(
    [
      {
        $match: matchStage
      },
      {
        $group:
        {
          _id: "$device", 
          max_hobbs_start: { $max: "$hobbs_start" },
          max_hobbs_stop: { $max: "$hobbs_stop" },
          max_engien_start: { $max: "$engien_start" },
          max_engien_stop: { $max: "$engien_stop" },
          min_engien_start: { $min: "$engien_start" },
          min_engien_stop: { $min: "$engien_stop" }
        }
      },
      {
        $project: {
          max_hobbs_start: { $toDouble: "$max_hobbs_start" }, // Converts Decimal128 to a regular number
          max_hobbs_stop: { $toDouble: "$max_hobbs_stop" }, // Converts Decimal128 to a regular number
          max_engien_start: { $toDouble: "$max_engien_start" }, // Converts Decimal128 to a regular number
          max_engien_stop: { $toDouble: "$max_engien_stop" }, // Converts Decimal128 to a regular number
          min_engien_start: { $toDouble: "$min_engien_start" }, // Converts Decimal128 to a regular number
          min_engien_stop: { $toDouble: "$min_engien_stop" } // Converts Decimal128 to a regular number
        }
      }
    
    ]
  );
 
  const deviceMaxValuesFiltered = maxValues.filter((item) => (item._id == _id)); 
  log.info("filter", deviceMaxValuesFiltered);
  return deviceMaxValuesFiltered;
}
const deviceMaxValues = async (_id) => {
  if(_id instanceof mongoose.Types.ObjectId ) {
    _id = _id.toString();
  }
  const maxValues = await Flight.aggregate(
    [
      
      {
        $group:
        {
          _id: "$device", 
          max_hobbs_start: { $max: "$hobbs_start" },
          max_hobbs_stop: { $max: "$hobbs_stop" },
          max_engien_start: { $max: "$engien_start" },
          max_engien_stop: { $max: "$engien_stop" }
        }
      },
      {
        $project: {
          max_hobbs_start: { $toDouble: "$max_hobbs_start" }, // Converts Decimal128 to a regular number
          max_hobbs_stop: { $toDouble: "$max_hobbs_stop" }, // Converts Decimal128 to a regular number
          max_engien_start: { $toDouble: "$max_engien_start" }, // Converts Decimal128 to a regular number
          max_engien_stop: { $toDouble: "$max_engien_stop" } // Converts Decimal128 to a regular number
        }
      }
    
    ]
  );
  log.info("filter", deviceMaxValues);
  const deviceMaxValuesFiltered = maxValues.filter((item) => (item._id == _id)); 
  log.info("filter", deviceMaxValuesFiltered);
  return deviceMaxValuesFiltered;
}
exports.device_max_min_engien_values = async function (req, res, next) {
  log.info(`flight ${req.params.id}`)
  try {
      let status = ["CLOSE"];
      const from = req.query.from;
      const to = req.query.to;
    if(req.query.status) {
      status = req.query.status.split(',');
    }
    const device = await findDevice({device_id: req.params.id})
    /* const deviceMaxValuesFiltered = await deviceMaxValues(device._id); */
    const deviceMaxValuesFiltered = await deviceMaxValuesWithStatus(device._id, status,from,to);
    if (deviceMaxValuesFiltered.length == 0) {
      return res.status(400).json({ success: false, errors: ["Device not exist"], data: [] })
    }
    return res.status(201).json({ success: true, errors: [], data: deviceMaxValuesFiltered })
  }
  catch (error) {
    return next(new ApplicationError("device_max_values", 400, "CONTROLLER.FLIGHT.DEVICE_MAX_VALUES.EXCEPTION", { name: "EXCEPTION", error }));
    
  }
};