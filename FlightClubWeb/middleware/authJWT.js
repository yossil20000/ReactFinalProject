const JWT = require('jsonwebtoken');
const Member = require('../Models/member');
const jwtService = require('../Services/jwtService');
const payload = {
    email: "",
    userId: "",
    roles: [],
    _id: ""
};
// SIGNING OPTIONS
const signOptions = {
    issuer: "FlightClubWeb",
    subject: process.env.SITE_MAIL,
    audience: "",
    expiresIn: process.env.JWT_TIMEOUT,
    algorithm: "HS256"
};
const signToken = function (payLoad) {
    const token = JWT.sign(payLoad, process.env.JWT_SECRET, signOptions);
    //const verify = JWT.verify(token, process.env.JWT_SECRET);
    //console.log("token_then_verify" , verify);
    return token;
}
const authenticate = (req, res, next) => {

    if (req.headers && req.headers.token) {
        const token = req.headers.token.replace('Bearer ', '');
        console.log(req.headers.token, 'req.headers.token');
        console.log(token, 'token');
        JWT.verify(token, process.env.JWT_SECRET, function (err, decode) {
            console.log("decode", decode);
            if (err) {
                console.log("verify", err);
                res.status(500).json({ success: false, errors: [err], data: [] });
            }
            else {
                console.log(decode);
                Member.findById(decode.userId)
                    .exec((err, user) => {
                        if (err) {
                            console.log("findOne error:", err);
                            res.status(500).json({ success: false, errors: [err], data: [] });
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
        console.log("Verify not enter")
        req.user = undefined;
        next();
    }
};

module.exports = {
    authenticate: authenticate,
    signToken: signToken,
    signOptions: signOptions,
    payload: payload
}