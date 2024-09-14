const Device = require('../Models/device');
const Member = require('../Models/member');
const constants = require('../Models/constants')
const FlightReservation = require('../Models/flightReservation');
const { ApplicationError } = require('../middleware/baseErrors');
const { CValidationError } = require('../Utils/CValidationError');
const async = require('async');
const log = require('debug-level').log('flightReservationController');

const { body, check, validationResult } = require('express-validator');
const { sendNotification } = require('../Services/notificationService');

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
		return next(new ApplicationError("reservation", 400, "CONTROLLER.RESERVATION.EXCEPTION", { name: "EXCEPTION", error }));
	}

};
exports.reservation_list = function (req, res, next) {
	try {
		log.info('reservation_list/params', req.query);
		let from = new Date(req.query.from);
		let to = new Date(req.query.to);
		let filter = { date_from: { $gte: from, $lte: to } };
		if (isNaN(from) || isNaN(to)) {
			filter = {}
		}
		FlightReservation.find(filter)
			.populate('device')
			.populate({ path: "member", select: "-password" })
			.sort({ date_from: -1, date_to: -1 })
			.exec((err, results) => {
				if (err) { log.critical('err'); return next(err); }
				else {
					log.info("reservation", results)
					res.status(201).json({ success: true, errors: [], data: results });
					return;
				}
			});
	}
	catch (error) {
		return next(new ApplicationError("reservation_list", 400, "CONTROLLER.RESERVATION.LIST.EXCEPTION", { name: "EXCEPTION", error }));
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

/* exports.reservation_delete_m2m = async function (req, res, next) {
	try {
		body("_id").trim().isLength({ min: 1 }).withMessage("_id must be specified");
		body("member_id").trim().isLength({ min: 1 }).withMessage("member_id must be specified");
		body("device_id").trim().isLength({ min: 1 }).withMessage("device_id must be specified");
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return next(new ApplicationError("reservation_delete_m2m", 400, "CONTROLLER.FLIGHT_RESERVE.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
		};
		log.info("reservation_delete/id", req.body);

		const flight2delete = await FlightReservation.findById(req.body._id)

		await flight2delete.remove();




	}
	catch (error) {
		return next(new ApplicationError("reservation_delete_m2m", 400, "CONTROLLER.FLIGHT_RESERV.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
	}
} */

exports.reservation_delete = function (req, res, next) {
	try {
		body("_id").trim().isLength({ min: 1 }).withMessage("_id must be specified");
		body("member_id").trim().isLength({ min: 1 }).withMessage("member_id must be specified");
		body("device_id").trim().isLength({ min: 1 }).withMessage("device_id must be specified");
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return next(new ApplicationError("reservation_delete", 400, "CONTROLLER.FLIGHT_RESERVE.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
		};
		log.log("reservation_delete/id", req.body);
		const flight2delete = FlightReservation.findById(req.body._id, (err, doc) => {
			if (err) {
				log.error("FlightReservation.findById/err", err);
				res.status(400).json({ success: false, errors: [err], data: results });
				return;
			}
			if (doc) {
				log.info("FlightReservation.findById/doc", doc)
				async.parallel({
					member_delete_flight: function (callback) {
						Member.findOneAndUpdate({ _id: doc.member._id }, { $pull: { flight_reservs: doc._id } }).exec(callback);
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
								const notifyMessage = `Flight from: ${doc.date_from} to: ${doc.date_to} \n on device: ${doc.device.device_id} by: ${doc.member.full_name}`
								sendNotification(constants.NotifyEvent.FlightReservation, constants.NotifyOn.DELETED, notifyMessage)
								res.status(201).json({ success: true, errors: ["delete"], data: doc });
							}
							return;
						}).populate('device member')
					}
				});
			}
		});
		log.info("FlightReservation.flight2delete", flight2delete)





	}
	catch (error) {
		return next(new ApplicationError("reservation_delete", 400, "CONTROLLER.FLIGHT_RESERV.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
	}
}
exports.reservation_create = [
	body('_id_device').trim().isLength({ min: 24, max: 24 }).escape().withMessage('device_id must be valid'),
	body('_id_member').trim().isLength({ min: 24, max: 24 }).escape().withMessage('member_id must be valid'),
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
				return next(new ApplicationError("reservation_create", 400, "CONTROLLER.FLIGHT_RESERVE.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
			}
			const member = await Member.findById(req.body._id_member).exec();
			const device = await Device.findById(req.body._id_device).exec();
			if (member == null || device == null) {
				res.status(400).json({ success: false, errors: ["Member or Device Not Exist"], data: [] });
				return;
			}
			let newReservation = new FlightReservation({
				date_from: new Date(req.body.date_from),
				date_to: new Date(req.body.date_to),
				member: req.body._id_member,
				device: req.body._id_device,
				timeOffset: Number((new Date(req.body.date_from)).getTimezoneOffset())
			});
			log.info("newReservation", newReservation._doc);
			const found = await FlightReservation.findOne({
				$and: [
					{ device: newReservation.device },
					{
						date_from: { "$lte": new Date(newReservation._doc.date_to) }, date_to: { "$gte": new Date(newReservation._doc.date_from) }

						/* $or: [
							{ $and: [{ data_from: { $lte: newReservation._doc.date_to } }, { date_to: { $gte: newReservation._doc.date_to } }] },
							{ $and: [{ data_from: { $lte: newReservation._doc.date_from } }, { date_to: { $gte: newReservation._doc.date_from } }] }
						] */
					}
				]
			}).exec();



			log.info("FlightReservation.find/doc", found?._doc);

			if (found?._doc === undefined) {
				newReservation.save(err => {
					if (err) {
						return res.status(500).json({ success: false, errors: [err], data: [] });
					}
				});
				device.flight_reservs.push(newReservation);
				member.flight_reservs.push(newReservation);
				/* const deviceSave = device.save(err => {
					if (err) {
						 return res.status(500).json({ success: false, errors: [err], data: [] }); 
						}
				}); */
				const deviceSave = await device.save()
				/* const memberSave = member.save(err => {
					if (err) { 
						return res.status(500).json({ success: false, errors: [err], data: [] }); 
					}
				}); */
				const memberSave = await member.save()

				const notifyResult = await sendNotification(constants.NotifyEvent.FlightReservation, constants.NotifyOn.CREATED, `Flight from: ${newReservation.date_from} to: ${newReservation.date_to} \n on device: ${device.device_id} by: ${member.full_name}`);
				log.info("FindSameFlight/end/flightNotification", newReservation.flightNotification);
				res.status(201).json({ success: true, errors: ["Created"], data: newReservation });
				log.info("FindSameFlight/end/created", newReservation.flightNotification);
				return;
			}
			else {
				log.info("Create/else_found", found?._doc);
				return next(new ApplicationError("reservation_create", 400, "CONTROLLER.FLIGHT_RESERV.CREATE_RESERVATION.VALIDATION", { name: "Validator", errors: (new CValidationError(newReservation._id, `Flight from:${newReservation.date_from.toLocaleString()} to:${newReservation.date_to.toLocaleString()}  already exist (${found?._doc.date_from.toLocaleString()} -${found?._doc.date_to.toLocaleString()}) `, '', "DB.Reservation")).validationResult.errors }));

			}
		}
		catch (error) {
			log.info("Create/catch (err)", error);
			return next(new ApplicationError("reservation_create", 400, "CONTROLLER.FLIGHT_RESERV.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
		}
		finally {
		}
	}];

exports.reservation_update = [
	body('device_name').trim().isLength({ min: 3 }).escape().withMessage('device_name lenght < 3'),
	body('date_from', 'Invalid date_from').isISO8601(),
	body('date_to', 'Invalid date_to').isISO8601(),
	body('date_to', 'date_to must be greater then date_from').isISO8601()
		.custom((value, { req }) => {
			if ((new Date(value) - new Date(req.body.date_from)) > 0) return true;
			return false;
		}),
	async (req, res, next) => {
		let notifyMessage = ""
		try {
			log.info("reservation_update/body", req.body);
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return next(new ApplicationError("reservation_update", 400, "CONTROLLER.FLIGHT_RESERVE.STATUS.VALIDATION", { name: "ExpressValidator", errors }));
			}
			else {
				let deviceFound = await Device.findOne({ device_id: req.body.device_name }).lean().exec()
				const results = await FlightReservation.findOne({ _id: req.body._id }).populate('device member').exec()
				log.info("reservation_update/newReservation", results)
				const found = await FlightReservation.find({
					$and: [
						{ device: deviceFound._id },
						{
							date_from: { "$lte": new Date(req.body.date_to) }, date_to: { "$gte": new Date(req.body.date_from) }
						}
					]
				}).lean().exec();
				if (found.length == 0 || (found.length == 1 && found[0]._id.toString() == results._id)) {

					const results = await FlightReservation.findOneAndUpdate({ _id: req.body._id }, { date_from: req.body.date_from, date_to: req.body.date_to, timeOffset: Number((new Date(req.body.date_from)).getTimezoneOffset()) }).populate('device member')
					notifyMessage = `Flight from: ${results.date_from} to: ${results.date_to} \n Changed to Flight From: ${req.body.date_from} To: ${req.body.date_to}\n on device: ${results.device.device_id} by: ${results.member.full_name}`
					await sendNotification(constants.NotifyEvent.FlightReservation, constants.NotifyOn.CHANGED, notifyMessage)
					return res.status(201).json({ success: true, errors: [], data: [] });
				}
				else {
					log.info("Update/else_found", found);
					return next(new ApplicationError("reservation_update", 400, "CONTROLLER.FLIGHT_RESERV.UPDATE_RESERVATION.VALIDATION", { name: "Validator", errors: (new CValidationError(found[0]._id.toString(), `Flight from:${req.body.date_from.toLocaleString()} to:${req.body.date_to.toLocaleString()}  already exist (${found[0].date_from.toLocaleString()} -${found[0].date_to.toLocaleString()}) `, '', "DB.Reservation")).validationResult.errors }));

				}

				/* FlightReservation.findOneAndUpdate(req.body._id, { date_from: req.body.date_from, date_to: req.body.date_to ,timeOffset: Number((new Date(req.body.date_from)).getTimezoneOffset())}, (err, results) => {
			if (err) {
				return res.status(400).json({ success: false, errors: [err], data: req.body });
			}
			else {
				

				return res.status(201).json({ success: true, errors: [], data: results });
			}
		}) */
			}
		}
		catch (error) {
			return next(new ApplicationError("reservation_update", 400, "CONTROLLER.FLIGHT_RESERV.STATUS.EXCEPTION", { name: "EXCEPTION", error }));
		}
		finally {

		}
	}
];

