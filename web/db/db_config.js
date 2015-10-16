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
var users = sequelize.define('user', {
  // User username
  username: {
    type: Sequelize.STRING(32),
    allowNull: false
  },
  // User password
  password: {
    type: Sequelize.STRING(32),
    allowNull: false
  },
  // User salt for password hashing
  salt: {
    type: Sequelize.STRING(32),
    allowNull: false
  },
  // User createdAt time
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  // User updatedAt time
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
});

// Sync to database
users.sync().then(function () {
  // Table created
  console.log('Synced to User Table');
});

//                             _       
//                            | |      
//   _____  ___ __   ___  _ __| |_ ___ 
//  / _ \ \/ / '_ \ / _ \| '__| __/ __|
// |  __/>  <| |_) | (_) | |  | |_\__ \
//  \___/_/\_\ .__/ \___/|_|   \__|___/
//           | |                       
//           |_|    

// Export users
module.exports.users = users;