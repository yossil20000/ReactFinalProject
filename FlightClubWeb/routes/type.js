const express = require('express');
const router = express.Router();

const TypeController = require('../Controllers/TypeController')
router.get('/:key',TypeController.expense_type);
router.post('/create',TypeController.create_type);
router.get('/selection/all',TypeController.selection_type);
module.exports = router;