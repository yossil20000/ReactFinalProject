const express = require('express');
const router = express.Router();

const orderController = require('../Controllers/orderController');
router.get('/', orderController.order_list);
router.get('/:_id',orderController.order);
router.delete('/', orderController.order_delete);
router.put('/update',orderController.order_update);
router.post('/create',orderController.order_create);
module.exports = router;