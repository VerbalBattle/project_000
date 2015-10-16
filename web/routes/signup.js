// Note: comments done with
// http://patorjk.com/software/taag/#p=display&f=Doom&t=Logger

//                       _              _ 
//                      (_)            | |
//  _ __ ___  __ _ _   _ _ _ __ ___  __| |
// | '__/ _ \/ _` | | | | | '__/ _ \/ _` |
// | | |  __/ (_| | |_| | | | |  __/ (_| |
// |_|  \___|\__, |\__,_|_|_|  \___|\__,_|
//              | |                       
//              |_|                         

// Requirements
var express = require('express');
var router = express.Router();
var userHelper = require('../db/db_helpers').userHelper;

//                  _            
//                 | |           
//  _ __ ___  _   _| |_ ___  ___ 
// | '__/ _ \| | | | __/ _ \/ __|
// | | | (_) | |_| | ||  __/\__ \
// |_|  \___/ \__,_|\__\___||___/

/* GET users listing. */
router.post('/', function (req, res, next) {
  // Get username
  var username = req.body.username;
  // Get password
  var password = req.body.password;
  console.log(req.body);
  console.log(password);
  // Attempt signup
  userHelper.signup(username, password,
    function (result) {
      res.send(result);
    });
});
module.exports = router;
