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
var usersHelper = require('../db/db_helpers').usersHelper;

//                  _            
//                 | |           
//  _ __ ___  _   _| |_ ___  ___ 
// | '__/ _ \| | | | __/ _ \/ __|
// | | | (_) | |_| | ||  __/\__ \
// |_|  \___/ \__,_|\__\___||___/

/* GET users listing. */
router.post('/', function (req, res, next) {
  var data = {
    // Username
    username: req.body.username,
    // Password
    password: req.body.password,
    // Callback
    callback: function (result) {
      res.send(result);
    }
  };
  console.log('\n\nSIGNUP\n\n');
  // Attempt signup
  usersHelper.signup(data);
});
module.exports = router;
