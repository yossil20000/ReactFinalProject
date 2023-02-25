var express = require('express');
var router = express.Router();

const notificationController = require('../Controllers/notificationController');

router.get('/',notificationController.notification_list);
router.post('/',notificationController.notification); 
router.post('/search',notificationController.notification_search)
router.post('/create',notificationController.notification_create);
router.put('/update',notificationController.notification_update);
module.exports = router; 