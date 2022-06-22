var express = require('express');
var router = express.Router();
var loginController = require('../Controllers/loginController');
const authJWT = require('../middleware/authJWT');
const authorize = require('../middleware/authorize');

router.put('/login', loginController.signin);
router.put('/logout',)
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
router.get('/hidden/:token', [authJWT.authenticate , authorize(['user'])], function(req,res,next) {

    if(!req.user){

        res.status(403).json(
            { success: false, errors: ["Invalid User token"], data: [] }
        )
    }
    else{
        res.status(200).json({ success: true, errors: [], data: {message: "Authorized"}});
    }
})
module.exports = router;