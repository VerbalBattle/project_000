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

var Sequelize = require('sequelize');

//           _               
//          | |              
//  ___  ___| |_ _   _ _ __  
// / __|/ _ \ __| | | | '_ \ 
// \__ \  __/ |_| |_| | |_) |
// |___/\___|\__|\__,_| .__/ 
//                    | |    
//                    |_|    

// Setup sequelize to connect to InsultPvP database
// with root user and empty password
var sequelize = new Sequelize('InsultPvP', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

// Define user model
var User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING
  }
});

// Sync to database
User.sync().then(function () {
  // Table created
  console.log('Synced to User Table');
});