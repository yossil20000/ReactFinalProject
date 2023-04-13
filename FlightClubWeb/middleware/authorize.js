const role = require("../Models/role");
var log = require('debug-level').log('authorize');


function authorize(roles = []){
    
    if(typeof roles === 'string'){
        roles = [roles];
    }
    return [
        (req,res,next) => {
            log.info("Authorize: req.user", req.user)
            if(roles.length  &&  req.user.roles.length )
            {
                const found =  roles.some(role =>  req.user.roles.includes(role));
                log.info("Roles found: " ,found);
                if(found)
                {return next();}
                else{
                    return res.status(400).json({success: false, errors :['Unauthorized'], data: []});
                }
            }
            else{
                return res.status(400).json({success: false, errors :['Unauthorized'], data: []});
            }
        }

    ]
        
}

module.exports = {
    authorize:authorize,
}
