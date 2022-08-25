const role = require("../Models/role");



function authorize(roles = []){
    
    if(typeof roles === 'string'){
        roles = [roles];
    }
    return [
        (req,res,next) => {
            console.log("Authorize: req.user", req.user)
            if(roles.length  &&  req.user.roles.length )
            {
                const found =  roles.some(role =>  req.user.roles.includes(role));
                console.log("Roles found: " ,found);
                if(found)
                {return next();}
                else{
                    return res.status(401).json({success: false, errors :['Unauthorized'], data: []});
                }
            }
            else{
                return res.status(401).json({success: false, errors :['Unauthorized'], data: []});
            }
        }

    ]
        
}

module.exports = {
    authorize:authorize,
}
