var express = require('express');
var router = express.Router();

const deviceController = require('../Controllers/deviceController');

router.get('/',deviceController.device_list);
router.get('/combo',deviceController.combo);
router.get('/:_id',deviceController.device);
router.get('/reserv/:_id',deviceController.device_reservation);
router.get('/flights/:_id',deviceController.device_flights);
router.post('/create',deviceController.create);
router.put('/update',deviceController.update);
router.put('/status',deviceController.status);
router.delete('/delete',deviceController.delete);

module.exports = router; 