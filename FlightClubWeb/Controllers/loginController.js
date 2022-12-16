const { body } = require('express-validator');
const { DataTime, DateTime } = require('luxon');
const Member = require('../Models/member');
const log = require('debug-level').log('LoginController');
const mail = require("../Services/mailService");
const jwtService = require('../Services/jwtService');
const authJWT = require('../middleware/authJWT');
const passGen = require('../Services/passwordGenerator');
const cookieParser = require('cookie-parser');
const { IsPasswordValid, passwordRequirement } = require('../Services/passwordGenerator');

exports.signin = function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    log.info(`login: ${email} ${password} ${username} `);

    Member.findOne({ "username": username, "contact.email": email }, (err, member) => {
        if (err) {
            console.info(`${email} Access Denied ${err}`)
        }
        if (member) {
            member.comparePassword(password, (err, isMatch) => {
                if (err) {
                    console.info(`${email} Access Denied comp`)
                }
                else if (isMatch) {

                    console.info(`${email} ${username} Access Pemitted`)
                    log.info(`${member.date_of_birth_formatted}`)

                    const payLoad = authJWT.payload;
                    payLoad.email = email;
                    payLoad.userId = member._id.toString();
                    payLoad.roles = member.role.roles;
                    //payLoad.id = member._id;
                    console.log("signein payload", payLoad);
                    const token = authJWT.signToken(payLoad);
                    const decodeJWT = jwtService.decodeJWT(token);
                    console.log("tokenExp", decodeJWT.exp);
                    res.cookie("token",token, {
                        path: '/',
                        httpOnly : true,
                        maxAge: 360000,
                        secure: true
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
                                username: member.username
                            },

                        }
                    });

                }
                else {
                    console.info(`${email}  Access Denied ElseIf`)
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
        return next(new ApplicationError("notice_list","400","CONTROLLER.NOTICE.NOTICE_LIST.EXCEPTION",{name: "EXCEPTION", error}));
    }
}
exports.reset = function (req, res, next) {
    console.log("reset.body", req.body);
    const email = req.body.email;
    const username = req.body.username;

    console.log("reset", email);
    Member.findOne({ "username": username, "contact.email": email }, (err, member) => {
        if (err) {
            console.info(`${email} Not Found ${err}`)
            return res.status(400).json({ success: false, errors: [err], message: `${email} Not Found` });
        }
        if (member) {
            log.info(`phone: ${member.code_area_phone}`)
            var password = passGen.getNewPassword(10);
            member.password = member.hash(password);
            member.updateOne({ password: member.password }).exec((err, result) => {
                if (err) {
                    console.log("Update Mail Failed", err);
                    return res.status(400).json({ success: false, errors: err, message: password, data: { newPassword: "" } });
                }
                else if (result) {
                    console.log("result", result)
                    mail.SendMail(member.contact.email, "Test", `Your temporary paassword is ${password}`).then((result) => {
                        console.log("Send Mail to:", member.contact.email);
                        return res.status(201).json(
                            {
                                success: true,
                                errors: [],
                                message: "password renew",
                                data: { newPassword: password }
                            });
                    }

                    ).catch((err => {
                        console.log("Send Mail");
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
    console.log("change_password", req.body);
    
    const username = req.body.username;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const user = req.user;
    console.log("change_password", newPassword);
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
                console.info(`${email} Not Found ${err}`)
                return res.status(400).json({ success: false, errors: [err], message: `${email} Not Found` });
            }
    
            if (member) {
                log.info(`Change passwor to : ${member.username}`)
                member.comparePassword(password, (err, isMatch) => {
                    if (isMatch) {
                        member.password = member.hash(newPassword);
                        member.updateOne({ password: member.password }).exec((err, result) => {
                            if (err) {
                                console.log("Update Mail Failed", err);
                                return res.status(400).json({ success: false, errors: err, message: [err], data: { newPassword: "" } });
                            }
                            else if (result) {
                                console.log("result", result)
                                mail.SendMail(member.contact.email, "Test", `Your temporary paassword is ${newPassword}`).then((result) => {
                                    console.log("Send Mail to:", member.contact.email);
                                    return res.status(201).json(
                                        {
                                            success: true,
                                            errors: [],
                                            message: "password renew",
                                            data: { newPassword: newPassword }
                                        });
                                }
    
                                ).catch((err => {
                                    console.log("Send Mail");
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
            console.log("register", req.body);
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
    catch (err) {

    }



}

