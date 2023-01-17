const Device = require('../Models/device');
const Member = require('../Models/member');
const FlightReservation = require('../Models/flightReservation');
const { ApplicationError } = require('../middleware/baseErrors');

const async = require('async');
const log = require('debug-level').log('flightReservationController');

const { body, check, validationResult } = require('express-validator');

exports.reservation = function (req, res, next) {
	try {
		log.info(`reservation ${req.params._id}`);
		FlightReservation.findById(req.params._id)
			.populate('device')
			.populate('member')
			.exec((err, results) => {
				if (err) {
					return res.status(400).json({ success: false, errors: ["FlightReservation Not Exist", err], data: results });
				}
				else {
					res.status(201).json({ success: true, errors: [], data: results });
					return;
				}
			});
	}
	catch (error) {
		return next(new ApplicationError("reservation", "400", "CONTROLLER.RESERVATION.EXCEPTION", { name: "EXCEPTION", error }));
	}

};
exports.reservation_list = function (req, res, next) {
	try {
		log.info('reservation_list/params', req.query);
		let from = new Date(req.query.from);
		let to = new Date(req.query.to);
		let filter = {date_from: {$gte : from, $lte: to}};
		if(isNaN(from) || isNaN(to)){
			filter = {}
		}
		FlightReservation.find(filter)
			.populate('device')
			.populate('member')
			.sort({ date_from: -1, date_to: -1 })
			.exec((err, results) => {
				if (err) { log.critical('err'); return next(err); }
				else {
					console.log("reservation", results)
					res.status(201).json({ success: true, errors: [], data: results });
					return;
				}
			});
	}
	catch (error) {
		return next(new ApplicationError("reservation_list", "400", "CONTROLLER.RESERVATION.LIST.EXCEPTION", { name: "EXCEPTION", error }));
	}

}
exports.reservation_create_s = (req, res, next) => {
	async.parallel({
		member: function (callback) {
			Member.findById(req.body.member_id).exec(callback)
		},
		device: function (callback) {
			Device.findById(req.body.device_id).exec(callback)
		}
	},
		function (err, results) {
			if (err) { return next(err); }
			if (results.member == null || results.device == null) {
				log.info(results);
				res.status(400).json({ success: false, errors: ["Member or Device Not Exist"], data: results });
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

exports.reservation_delete_m2m = async function (req, res, next) {
	try {
		body("_id").trim().isLength({ min: 1 }).withMessage("_id must be specified");
		body("member_id").trim().isLength({ min: 1 }).withMessage("member_id must be specified");
		body("device_id").trim().isLength({ min: 1 }).withMessage("device_id must be specified");
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return next(new ApplicationError("reservation_delete_m2m", "400", "CONTROLLER.FLIGHT_RESERVE.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
		};
		console.log("reservation_delete/id", req.body);

		const flight2delete = await FlightReservation.findById(req.body._id)

		await flight2delete.remove();




	}
	catch (error) {
		return next(new ApplicationError("reservation_delete_m2m", "400", "CONTROLLER.FLIGHT_RESERV.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
	}
}

exports.reservation_delete = function (req, res, next) {
	try {
		body("_id").trim().isLength({ min: 1 }).withMessage("_id must be specified");
		body("member_id").trim().isLength({ min: 1 }).withMessage("member_id must be specified");
		body("device_id").trim().isLength({ min: 1 }).withMessage("device_id must be specified");
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return next(new ApplicationError("reservation_delete", "400", "CONTROLLER.FLIGHT_RESERVE.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
		};
		console.log("reservation_delete/id", req.body);
		const flight2delete = FlightReservation.findById(req.body._id, (err, doc) => {
			if (err) {
				console.log("FlightReservation.findById/err", err);
				res.status(400).json({ success: false, errors: [err], data: results });
				return;
			}
			if (doc) {
				console.log("FlightReservation.findById/doc", doc)
				async.parallel({
					member_delete_flight: function (callback) {
						Member.findOneAndUpdate(doc.member._id, { $pull: { flight_reservs: doc._id } }).exec(callback);
					},
					device_delete_flight: function (callback) {
						Device.findById(doc.device._id)
							.updateOne({ $pull: { flight_reservs: doc._id } })
							.exec(callback);
					}

				}, function (err, results) {
					if (err) {
						res.status(400).json({ success: false, errors: [err], data: results });
						return;
					}
					else {
						FlightReservation.findByIdAndDelete(req.body._id, (err, doc) => {
							if (err) {
								res.status(400).json({ success: false, errors: [err], data: doc });
							}
							else {
								res.status(201).json({ success: true, errors: ["delete"], data: doc });
							}
							return;
						})
					}
				});
			}
		});
		console.log("FlightReservation.flight2delete", flight2delete)





	}
	catch (error) {
		return next(new ApplicationError("reservation_delete", "400", "CONTROLLER.FLIGHT_RESERV.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
	}
}
exports.reservation_create = [
	body('_id_device').trim().isLength({ min: 24, max:24 }).escape().withMessage('device_id must be valid'),
	body('_id_member').trim().isLength({ min: 24, max:24 }).escape().withMessage('member_id must be valid'),
	body('date_from', 'Invalid date_from').isISO8601(),
	body('date_to', 'Invalid date_to').isISO8601(),
	body('date_to', 'date_to must be greater then date_from').isISO8601()
		.custom((value, { req }) => {
			if ((new Date(value) - new Date(req.body.date_from)) > 0) return true;
			return false;
		})
	, async function (req, res, next) {
		try {
			log.info("reservation_create/body", req.body)
			log.info("newReservation/convertooffset", (new Date(req.body.date_from)).getTimezoneOffset());
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return next(new ApplicationError("reservation_create", "400", "CONTROLLER.FLIGHT_RESERVE.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
			}
			const member = await Member.findById(req.body._id_member).exec();
			const device = await Device.findById(req.body._id_device).exec();
			if (member == null || device == null) {
				res.status(400).json({ success: false, errors: ["Member or Device Not Exist"], data: [] });
				return;
			}
			let newReservation = new FlightReservation({
				date_from: req.body.date_from,
				date_to: req.body.date_to,
				member: req.body._id_member,
				device: req.body._id_device,
				timeOffset: Number((new Date(req.body.date_from)).getTimezoneOffset())
			});
			log.info("newReservation", newReservation._doc);
			const found = await FlightReservation.findOne({
				$and: [
					{ device: newReservation.device },
					{
						$or: [
							{ $and: [{ data_from: { $lte: newReservation._doc.date_to } }, { date_to: { $gte: newReservation._doc.date_to } }] },
							{ $and: [{ data_from: { $lte: newReservation._doc.date_from } }, { date_to: { $gte: newReservation._doc.date_from } }] }
						]
					}
				]
			}).exec();



			log.info("FlightReservation.find/doc", found?._doc);
			if (found?._doc === undefined) {
				await newReservation.save(err => {
					if (err) { return res.status(500).json({ success: false, errors: [err], data: [] }); }
				});
				device.flight_reservs.push(newReservation);
				member.flight_reservs.push(newReservation);
				await device.save(err => {
					if (err) { return res.status(500).json({ success: false, errors: [err], data: [] }); }
				});
				await member.save(err => {
					if (err) { return res.status(500).json({ success: false, errors: [err], data: [] }); }
				});
				res.status(201).json({ success: true, errors: ["Created"], data: newReservation });
				log.info("FindSameFlight/end/created");
				return;
			}
			else {
				log.info("Create/else");
				res.status(400).json({ success: false, errors: ["Reservation Already Exist"], data: newReservation });
			}
		}
		catch (error) {
			log.info("Create/catch (err)",error);
			return next(new ApplicationError("reservation_create", "400", "CONTROLLER.FLIGHT_RESERV.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
		}
		log.info("Create/end");
	}];


exports.reservation_update = [
	body('date_from', 'Invalid date_from').isISO8601(),
	body('date_to', 'Invalid date_to').isISO8601(),
	body('date_to', 'date_to must be greater then date_from').isISO8601()
		.custom((value, { req }) => {
			if ((new Date(value) - new Date(req.body.date_from)) > 0) return true;
			return false;
		}),
	(req, res, next) => {
		try {
			log.info("reservation_update/body", req.body);
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return next(new ApplicationError("reservation_update", "400", "CONTROLLER.FLIGHT_RESERVE.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
			}
			else {
				FlightReservation.findOneAndUpdate(req.body._id, { date_from: req.body.date_from, date_to: req.body.date_to ,timeOffset: Number((new Date(req.body.date_from)).getTimezoneOffset())}, (err, results) => {
					if (err) {
						return res.status(400).json({ success: false, errors: [err], data: req.body });
					}
					else {
						return res.status(201).json({ success: true, errors: [], data: results });
					}
				})
			}
		}
		catch (error) {
			return next(new ApplicationError("reservation_update", "400", "CONTROLLER.FLIGHT_RESERV.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
		}
	}
];

