const JWT = require('jsonwebtoken');
const Member = require('../Models/member');
const jwtService = require('../Services/jwtService');
const payload = {
    email: "",
    userId:"",
    roles:[]
   };
// SIGNING OPTIONS
const signOptions = {
    issuer:  "FlightClubWeb",
    subject:  process.env.SITE_MAIL,
    audience:  "",
    expiresIn:  process.env.JWT_TIMEOUT,
    algorithm:  "HS256"
   };
const signToken = function(payLoad){
    const token = JWT.sign(payLoad, process.env.JWT_SECRET,signOptions);
    //const verify = JWT.verify(token, process.env.JWT_SECRET);
    //console.log("token_then_verify" , verify);
    return token;
}
const authenticate = (req, res, next) => {
    const token = req.body.token.replace('Bearer ', '')
    const tokenH = req.headers.token.replace('Bearer ', '');
    console.log(req.headers.token , 'tokenH');
    var tokenParam = req.params.token.replace('Bearer ', '');
    console.log("tokenParams", tokenParam);
    //console.log("is true",  req.headers.authorization.split(" ")[0].includes("JWT"));
    console.log("process.env.JWT_SECRET", process.env.JWT_SECRET);
    if (/* req.headers &&
        req.headers.authorization &&
        req.headers.authorization */true) {
        const verify = JWT.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inlvc0BnbWFpbC5jb20iLCJpYXQiOjE2NDc1OTM2NTl9.VQCRysGoH33ELOLhDjky6KtZehVQ37FlPUChEH2YnOM", process.env.JWT_SECRET);
        console.log("verify_deirect" , verify);
        const verify1 = JWT.verify(token, process.env.JWT_SECRET);
        console.log("verify1" , verify1);
        JWT.verify(tokenParam, process.env.JWT_SECRET, function (err, decode) {
            console.log("decode",decode);
            if (err){
                console.log("verify", err);
                req.user = undefined;
                next();
            }
            else{
                console.log(decode);
                Member.findById(decode.userId)
                .exec((err, user) => {
                    if(err){
                        console.log("findOne error:",err);
                        res.status(500).json({ success: false, errors: [err], data: [] });
                    }
                    else{
                        console.log("findOne:",user);
                        req.user = decode;
                        next();
                    }
                })
            }
        })
    }
    else{
        console.log("Verify not enter")
        req.user = undefined;
        next();
    }
};

module.exports ={
    authenticate: authenticate,
    signToken: signToken,
    signOptions: signOptions,
    payload: payload
}