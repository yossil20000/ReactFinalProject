const express = require('express');
const router = express.Router();

const deviceTypeController = require('../Controllers/deviceTypeController');

router.get('/', deviceTypeController.deviceType_list);
router.get('/:_id',deviceTypeController.deviceType_detail);
router.delete('/', deviceTypeController.deviceType_delete);
router.put('/update',deviceTypeController.deviceType_update);
router.put('/status',deviceTypeController.deviceType_status);
router.post('/create',deviceTypeController.deviceType_create);
module.exports = router;