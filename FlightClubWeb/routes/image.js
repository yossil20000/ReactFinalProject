var express = require('express');
var router = express.Router();

const imageController = require('../Controllers/imageController');

router.get('/',imageController.image_list);
router.get('/:_id',imageController.image);
router.post('/create' , imageController.image_create);
router.delete('/delete', imageController.image_delete);
router.put("/update",imageController.image_update); 

module.exports = router; 