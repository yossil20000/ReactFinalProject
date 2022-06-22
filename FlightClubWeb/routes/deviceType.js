const express = require('express');
const router = express.Router();

const deviceTypeController = require('../Controllers/deviceTypeController');

router.get('/', deviceTypeController.deviceType_list);
router.get('/:_id',deviceTypeController.deviceType_detail);
router.delete('/:_id', deviceTypeController.deviceType_delete);
router.put('/update',deviceTypeController.deviceType_update);
router.post('/create',deviceTypeController.deviceType_create);
module.exports = router;