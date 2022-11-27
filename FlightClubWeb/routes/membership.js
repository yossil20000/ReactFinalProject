var express = require('express');
var router = express.Router();

const membershipController = require('../Controllers/membershipController');

router.get('/', membershipController.membership_list);
router.get('/combo', membershipController.membership_combo);
//router.get('/detail/:id', membershipController.membership_detail);
//router.delete('/:membershipId', membershipController.membership_delete);
//router.post('/',membershipController.membership_create);
router.put('/update',membershipController.membership_update);
module.exports = router;