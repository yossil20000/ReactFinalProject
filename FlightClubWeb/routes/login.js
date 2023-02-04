var express = require('express');
var router = express.Router();
var loginController = require('../Controllers/loginController');
var memberController = require('../Controllers/memberController')
const authJWT = require('../middleware/authJWT');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../Models/constants');

router.put('/login', loginController.signin);
router.put('/logout',loginController.logout)
router.put('/reset_password', loginController.reset);
router.get('/hidden', authJWT.authenticate, function(req,res,next) {

    if(!res.user){
        res.status(403).json(
            { success: false, errors: ["Invalid User token"], data: [] }
        )
    }
    else{
        res.status(200).json({ success: true, errors: [], data: {message: "Authorized"}});
    }
});
router.get('/hidden/:token', [authJWT.authenticate], function(req,res,next) {

    if(!req.user){

        res.status(403).json(
            { success: false, errors: ["Invalid User token"], data: [] }
        )
    }
    else{
        res.status(200).json({ success: true, errors: [], data: {message: "Authorized"}});
    }
})
router.put('/change_password',authJWT.authenticate,loginController.change_password)
router.post('/register', [authJWT.authenticate, authorize.authorize([ROLES[4],ROLES[5]])], loginController.register,memberController.member_create);
module.exports = router;