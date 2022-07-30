function passwordGenerator(nChar){
    var password ="";
    const string_length = nChar
 password = [...Array(string_length)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
console.log(password);
return password;
}

module.exports = {
    passwordGenerator: passwordGenerator,
} ;