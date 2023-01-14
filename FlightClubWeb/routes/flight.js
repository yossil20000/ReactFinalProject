const express = require('express');
const router = express.Router();
const flightController = require('../Controllers/flightControrller');

router.get('/', flightController.flight_list);
router.get('/:_id', flightController.flight);
router.get('/search/date', flightController.flight_list);
router.get('/search/filter',flightController.flight_search);
router.post('/create' , flightController.flight_create);
router.delete('/delete', flightController.flight_delete);
router.put("/update",flightController.flight_update);
module.exports = router;
