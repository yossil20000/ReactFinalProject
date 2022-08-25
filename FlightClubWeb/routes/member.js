var express = require('express');
const authJWT = require('../middleware/authJWT');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../Models/constants');

var router = express.Router();

const memberController = require('../Controllers/memberController');

router.get('/',[authJWT.authenticate], memberController.member_list);
router.get('/detail/:id',[authJWT.authenticate, authorize.authorize([ROLES[1],ROLES[2],ROLES[3],ROLES[4]])] ,memberController.member_detail);
router.get('/reserv', [authJWT.authenticate, authorize.authorize([ROLES[1],ROLES[2],ROLES[3],ROLES[4]])] ,memberController.members_flights_reserv);
router.delete('/:memberId', [authJWT.authenticate, authorize.authorize([ROLES[3],ROLES[4]])] ,memberController.member_delete);
router.post('/',[authJWT.authenticate, authorize.authorize([ROLES[3],ROLES[4]])] ,memberController.member_create);
router.put('/',[authJWT.authenticate, authorize.authorize([ROLES[1],ROLES[2],ROLES[3],ROLES[4]])] ,memberController.member_update);
module.exports = router;