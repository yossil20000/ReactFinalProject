const JWT = require('jsonwebtoken');
const Member = require('../Models/member');
const jwtService = require('../Services/jwtService');
const { ApplicationError } = require('../middleware/baseErrors');
const { CValidationError } = require('../Utils/CValidationError');

const payload = {
    email: "",
    userId: "",
    roles: [],
    _id: ""
};
// SIGNING OPTIONS
let signOptions = {
    issuer: "FlightClubWeb",
    subject: process.env.SITE_MAIL,
    audience: "",
    expiresIn: process.env.JWT_TIMEOUT,
    algorithm: "HS256"
};
const signToken = function (payLoad,timeOut) {
    signOptions.expiresIn = timeOut
    const token = JWT.sign(payLoad, process.env.JWT_SECRET, signOptions);
    //const verify = JWT.verify(token, process.env.JWT_SECRET);
    //console.log("token_then_verify" , verify);
    return token;
}
const authenticate = (req, res, next) => {
    try{
        if (req.headers && req.headers.authorization) {
            const cookie = req.cookies
            console.log(cookie, 'authenticate/cookies');
            const token = req.headers.authorization.replace('Bearer ', '');
            console.log(req.headers.authorization, 'req.headers.authorization');
            console.log(token, 'authenticate token');
            JWT.verify(token, process.env.JWT_SECRET, function (err, decode) {
                console.log("decode", decode);
                if (err) {
                    console.log("authenticate verify", err);
                    return next(new ApplicationError("authenticate", 403, "AUTHENTICATE.TOKEN.VALIDATION", { name: "Validator", errors: (new CValidationError("token", `TOKEN EXPIRED OR UNVALID`, 'VERIFY_1', "DB.Account")).validationResult.errors }));
                    /* res.status(403).json({ success: false, errors: [err], message: "In Valid Authorization" , data: [] }); */
                }
                else {
                    console.log(decode);
                    Member.findById(decode.userId)
                        .exec((err, user) => {
                            if (err) {
                                console.log("authenticate findOne error:", err);
                                return next(new ApplicationError("authenticate", 403, "AUTHENTICATE.TOKEN.VALIDATION", { name: "Validator", errors: (new CValidationError("token", `TOKEN EXPIRED OR UNVALID`, 'VERIFY_2', "DB.Account")).validationResult.errors }));
                            
                            }
                            else {
                                console.log("findOne:", user);
                                req.user = decode;
                                next();
                            }
                        })
                }
            })
        }
        else {
            console.log("authenticate Verify not enter")
            req.user = undefined;
            return next(new ApplicationError("authenticate", 403, "AUTHENTICATE.TOKEN.VALIDATION", { name: "Validator", errors: (new CValidationError("TOKEN", `TOKEN EXPIRED OR UNVALID`, 'VERIFY_3', "DB.Account")).validationResult.errors }));
            
        }
    }
    catch(error){
        return next(new ApplicationError("account", 403, "AUTHENTICATE.TOKEN.VALIDATION", { name: "EXCEPTION", error }));
    }

};

module.exports = {
    authenticate: authenticate,
    signToken: signToken,
    signOptions: signOptions,
    payload: payload
}