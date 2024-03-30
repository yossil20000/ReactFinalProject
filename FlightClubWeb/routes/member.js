var express = require('express');
const authJWT = require('../middleware/authJWT');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../Models/constants');

var router = express.Router();

const memberController = require('../Controllers/memberController');

router.get('/',[authJWT.authenticate],  memberController.member_list);
router.post('/combo',[authJWT.authenticate],  memberController.combo);
router.get('/detail/:id',[authJWT.authenticate, authorize.authorize([ROLES[1],ROLES[2],ROLES[3],ROLES[4],ROLES[5]])] ,memberController.member_detail);
router.get('/reserv', [authJWT.authenticate, authorize.authorize([ROLES[2],ROLES[3],ROLES[4],ROLES[5]])] ,memberController.members_flights_reserv);
router.get('/last_id', [authJWT.authenticate, authorize.authorize([ROLES[2],ROLES[3],ROLES[4],ROLES[5]])] ,memberController.member_lastId);
router.delete('/:memberId',  [authJWT.authenticate, authorize.authorize([ROLES[5]])] , memberController.member_delete);

router.post('/',[authJWT.authenticate, authorize.authorize([ROLES[4],ROLES[5]])] ,memberController.member_create);
router.put('/',[authJWT.authenticate, authorize.authorize([ROLES[2],ROLES[3],ROLES[4],ROLES[5]])] ,memberController.member_update);
router.put('/status',[authJWT.authenticate, authorize.authorize([ROLES[5]])] ,memberController.member_status);
router.put('/summary',[authJWT.authenticate, authorize.authorize([ROLES[2],ROLES[3],ROLES[4],ROLES[5]])] ,memberController.member_flight_summary);
module.exports = router;