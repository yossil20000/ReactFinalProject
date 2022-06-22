var express = require('express');
var router = express.Router();

const memberController = require('../Controllers/memberController');

router.get('/', memberController.member_list);
router.get('/detail/:id', memberController.member_detail);
router.get('/reserv', memberController.members_flights_reserv);
router.delete('/:memberId', memberController.member_delete);
router.post('/',memberController.member_create);
router.put('/',memberController.member_update);
module.exports = router;