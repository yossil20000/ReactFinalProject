var express = require('express');
var bcrypt = require('bcrypt');
const res = require('express/lib/response');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
 
  let list = [
      {name: 'PHP'},
      {name: 'Ruby'},
      {name: 'Java'},
      {name: 'Python'},
      {name: 'dotNet'},
      {name: 'C#'},
      {name: 'Swift'},
      {name: 'Pascal'},
  ]
  res.render('index', {title: 'Demo Ejs', list: list});
});

router.get('/help', (req , res) => {
    return res.render('help',{options: [{phone: "054907444", chat: "Customer Service",type:"Online"} , {phone: "054907445", chat: "Technical Service",type:"Whatsup"} ]});
})

router.get('/hash/:password', async (req , res) => {

  const p="1234";
  const password = req.params.password ;

  
  const hasshedPassword = await bcrypt.hash(p,8);
  if(bcrypt.compareSync(password, hasshedPassword))
  {
     return res.json({passoerd: password, hasshedPassword: hasshedPassword, loging: "Succeed"});; 
  }
  return res.json({passoerd: password, hasshedPassword: hasshedPassword ,  loging: "Failed"});
})
module.exports = router;
