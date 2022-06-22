const express = require('express');
const router = express.Router();
const flightReservController = require('../Controllers/flightReservController');

router.get('/', flightReservController.reservation_list);
router.get('/:_id', flightReservController.reservation);
router.post('/create' , flightReservController.reservation_create);
router.delete('/delete', flightReservController.reservation_delete);
router.put('/update', flightReservController.reservation_update);
module.exports = router;
