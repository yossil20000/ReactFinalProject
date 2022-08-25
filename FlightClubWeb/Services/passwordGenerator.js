const passwordRequirement = "Checks that a password has a minimum of 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number , and 1 @ or $ with no spaces."
const passwordPattern = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[@$]).{8,})\S$/
function passwordGenerator(nChar){
    var password ="";
    const string_length = nChar
 password = [...Array(string_length)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
console.log(password);
return password;
}
function IsPasswordValid(password){
    if(password.match(passwordPattern))
        return true;
    return false;    

}
module.exports = {
    passwordGenerator: passwordGenerator,
    IsPasswordValid: IsPasswordValid,
    passwordRequirement : passwordRequirement
} ;

