const passwordRequirement = "Checks that a input has a minimum of 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number , and 1 @ or $ with no spaces."

 function getNewPassword(nChar){
    let password="";
    let counter=0;
    do{ 
        password = makeid(nChar);
        counter++;
        if(counter > 100) break;
    }while(!IsPasswordValid(password) )
    return password;
}
function passwordGenerator(nChar){
    var password ="";
    const string_length = nChar
 password = [...Array(string_length)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
console.log(password);
return password;
}
 function IsPasswordValid(password){
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[!@_])[^<>?$&*%()+-]{8,}$/.test(password)
}

 function IsUsernameValid(username){
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[!@_])[^<>?$&*%()+-]{8,12}$/.test(username)
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
module.exports = {
    passwordGenerator: passwordGenerator,
    IsPasswordValid: IsPasswordValid,
    getNewPassword: getNewPassword,
    IsUsernameValid: IsUsernameValid,
    passwordRequirement : passwordRequirement
} ;

