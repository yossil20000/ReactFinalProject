const Device = require('../Models/device');
const Member = require('../Models/member');
const FlightReservation = require('../Models/flightReservation');
const Flight = require('../Models/flight');

const async = require('async');
const log = require('debug-level').log('flightReservationController');

const {body, check,validationResult} = require('express-validator');
const member = require('../Models/member');
exports.reservation = function(req,res,next) {
	log.info(`reservation ${req.params._id}`);
	FlightReservation.findById(req.params._id)
	.populate('device')
	.populate('member')
	.exec((err,results) => {
		if(err){
			return res.status(401).json({success: false, errors : ["FlightReservation Not Exist", err], data: results});	
		}
		else{
			res.status(401).json({success: true, errors : [], data: results});
			return;
		}
	});
};
exports.reservation_list = function(req,res,next){
	log.info('reservation_list');
	FlightReservation.find()
	.populate('device')
	.populate('member')
	.sort({date_from: -1, date_to: -1})
	.exec((err,results) => {
		if(err) { log.critical('err'); return next(err);}
		else{
			res.status(201).json({success: true, errors : [], data: results});
			return;
		}
	});
}
exports.reservation_create_s = (req,res,next) =>{
	async.parallel({
		member: function(callback){
		Member.findById(req.body.member_id).exec(callback)
	},
	device: function(callback){
		Device.findById(req.body.device_id).exec(callback)
	}
}, 
function(err, results){
	if(err) { return next(err);}
	if(results.member == null || results.device == null)
	{
		log.info(results);
		res.status(401).json({success: false, errors : ["Member or Device Not Exist"], data: results});
		return;
	}

	let newReservation = new FlightReservation({
		data_from: req.body.date_from,
		date_to: req.body.date_to,
		member: req.body.member_id,
		device: req.body.device_id
	});
	newReservation.save();
	results.device.flight.push(newReservation);
	results.member.flight.push(newReservation);
	results.device.save();
	results.member.save();
}
)
}

exports.reservation_delete= function(req,res,next){
	try{
		body("_id").trim().isLength({min:1}).withMessage("_id must be specified");
		body("member_id").trim().isLength({min:1}).withMessage("member_id must be specified");
		body("device_id").trim().isLength({min:1}).withMessage("device_id must be specified");
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(401).json({success: false, errors : errors, data: []});
		};
		async.parallel({
			member_delete_flight: function(callback){
				Member.findOneAndUpdate(req.body.member_id,{$pull: {flights: req.body._id}}).exec(callback);
			},
			device_delete_flight: function(callback){
				Device.findById(req.body.device_id)
				.updateOne({$pull: {flights: req.body._id}})
				.exec(callback);
			}

		}, function(err,results){
			if(err){
				res.status(401).json({success: false, errors:[err], data: results});		
				return;
			}
			else{
				FlightReservation.findByIdAndDelete(req.body._id, (err,doc) => {
					if(err){
						res.status(401).json({success: false, errors:[err], data: doc});
					}
					else{
						res.status(201).json({success: true, errors:[err], data: doc});
					}
					return;
				})
			}
		});
		
		
		

	}
	catch(err){
		log.log(err);
		return next(err);
		res.status(401).json({success: false, errors:[err], data: []});
	}
}


exports.reservation_create = [
	
	body('device_id').trim().isLength({min:1}).escape().withMessage('device_id must be valid'),
	body('member_id').trim().isLength({min:1}).escape().withMessage('member_id must be valid'),
	body('date_from','Invalid date_from').trim().isISO8601().toDate(),
	body('date_to','Invalid date_to').trim().isISO8601().toDate(),
	body('date_to','date_to must be greater then date_from').trim().isISO8601().toDate()
	.custom((value,{req}) => {
			if((value -  req.body.date_from) > 0) return true;
			return false;
	}),
	
	(req,res,next) => {
		log.info(req.body);
		
		
		async.parallel({
			member: function(callback){
			Member.findById(req.body.member_id).exec(callback)
		},
		device: function(callback){
			Device.findById(req.body.device_id).exec(callback)
		}
	}, 
	function(err, results){
		if(err) { return next(err);}
		if(results.member == null || results.device == null)
		{
			log.info(results);
			res.status(401).json({success: false, errors : ["Member or Device Not Exist"], data: results});
			return;
		}
			
		
		const errors = validationResult(req);
		if(!errors.isEmpty())
		{
			return res.status(401).json({success: false, errors : errors, data: req.body});
		}
		let newReservation = new FlightReservation({
			data_from: req.body.date_from,
			date_to: req.body.date_to,
			member: req.body.member_id,
			device: req.body.device_id
		});
		newReservation.save(err => {
			if(err) {return res.status(500).json({success: false, errors : [err], data: []});}
		});
		results.device.flights.push(newReservation);
		results.member.flights.push(newReservation);
		results.device.save(err => {
			if(err) {return res.status(500).json({success: false, errors : [err], data: []});}
		});
		results.member.save(err => {
			if(err) {return res.status(500).json({success: false, errors : [err], data: []});}
		});
		res.status(201).json({success: true, errors : ["Created"], data: newReservation});
		return;
	}
	)
	}



];

exports.reservation_update = [
	body('date_from','Invalid date_from').trim().isISO8601().toDate(),
	body('date_to','Invalid date_to').trim().isISO8601().toDate(),
	body('date_to','date_to must be greater then date_from').trim().isISO8601().toDate()
	.custom((value,{req}) => {
			if((value -  req.body.date_from) > 0) return true;
			return false;
	}),
	(req,res,next) => {
		const errors = validationResult(req);
		if(!errors.isEmpty())
		{
			return res.status(401).json({success: false, errors : errors, data: req.body});
		}
		else{
			FlightReservation.findOneAndUpdate(req.body._id , {date_from: req.body.date_from, date_to: req.body.date_to},(err,results) => {
				if(err){
					return res.status(401).json({success: false, errors:[err], data: req.body});
				}
				else{
					return res.status(201).json({success: true, errors : [], data: results});
				}
			})
		}
	}
];