var express = require('express');
var router = express.Router();

const deviceController = require('../Controllers/deviceController');

router.get('/',deviceController.device_list);
router.get('/reserv/:_id',deviceController.device_reservation);

module.exports = router; 