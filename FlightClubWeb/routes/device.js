var express = require('express');
var router = express.Router();

const deviceController = require('../Controllers/deviceController');

router.get('/',deviceController.device_list);
router.post('/combo',deviceController.device_combo);
router.get('/can_reserv/:_id',deviceController.can_reserv);
router.get('/device/:_id',deviceController.device);
router.get('/reserv/:_id',deviceController.device_reservation);
router.get('/flights/:_id',deviceController.device_flights);
router.post('/create',deviceController.create);
router.put('/update',deviceController.update);
router.put('/updateOne',deviceController.updateOne);
router.put('/status',deviceController.status);
router.delete('/delete',deviceController.delete);
router.get('/report/:device_id',deviceController.device_report)

module.exports = router; 