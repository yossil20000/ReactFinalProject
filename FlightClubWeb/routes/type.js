const express = require('express');
const router = express.Router();

const TypeController = require('../Controllers/TypeController')
router.get('/:key',TypeController.type);
module.exports = router;