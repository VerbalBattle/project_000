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

// Require sequelize
var Sequelize = require('sequelize');
// Require bcrypt
var bcrypt = require('bcrypt');

//                                _   _      _                 
//  _ __ ___   ___  _ __ ___  ___| | | | ___| |_ __   ___ _ __ 
// | '__/ _ \ / _ \| '_ ` _ \/ __| |_| |/ _ \ | '_ \ / _ \ '__|
// | | | (_) | (_) | | | | | \__ \  _  |  __/ | |_) |  __/ |   
// |_|  \___/ \___/|_| |_| |_|___/_| |_|\___|_| .__/ \___|_|   
//                                            |_|              

// Rooms helper master object
var roomsHelper = {};

//                             _       
//                            | |      
//   _____  ___ __   ___  _ __| |_ ___ 
//  / _ \ \/ / '_ \ / _ \| '__| __/ __|
// |  __/>  <| |_) | (_) | |  | |_\__ \
//  \___/_/\_\ .__/ \___/|_|   \__|___/
//           | |                       
//           |_|    

// Export users helpers
module.exports = roomsHelper;