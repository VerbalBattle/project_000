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
               
//  _   _ ___  ___ _ __ ___ 
// | | | / __|/ _ \ '__/ __|
// | |_| \__ \  __/ |  \__ \
//  \__,_|___/\___|_|  |___/

// Define user model
var users = sequelize.define('user', {
  // User username / PRIMARY KEY
  username: {
    primaryKey: true,
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

//        _                           
//       | |                          
//  _ __ | | __ _ _   _  ___ _ __ ___ 
// | '_ \| |/ _` | | | |/ _ \ '__/ __|
// | |_) | | (_| | |_| |  __/ |  \__ \
// | .__/|_|\__,_|\__, |\___|_|  |___/
// | |             __/ |              
// |_|            |___/               

// Define player model
var players = sequelize.define('players', {
  // Player name / PRIMARY KEY
  playername: {
    primaryKey: true,
    type: Sequelize.STRING(32),
    allowNull: false
  },
  // Player image path
  imagePath: {
    type: Sequelize.STRING(32),
    allowNull: false
  },
  // Player about me
  aboutMe: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  // Player createdAt time
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  // Player updatedAt time
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
});

// Players FOREIGN KEY
users.hasMany(players, {
  foreignKey: {
    name: 'username',
    allowNull: false
  }
});

//        _                       _____ _        _       
//       | |                     /  ___| |      | |      
//  _ __ | | __ _ _   _  ___ _ __\ `--.| |_ __ _| |_ ___ 
// | '_ \| |/ _` | | | |/ _ \ '__|`--. \ __/ _` | __/ __|
// | |_) | | (_| | |_| |  __/ |  /\__/ / || (_| | |_\__ \
// | .__/|_|\__,_|\__, |\___|_|  \____/ \__\__,_|\__|___/
// | |             __/ |                                 
// |_|            |___/                                  

// Define player stats model
var playerStats = sequelize.define('playerStats', {
  // Player name / FOREIGN KEY / PRIMARY KEY
  playername: {
    primaryKey: true,
    type: Sequelize.STRING(32),
    references: {
      model: 'players',
      key: 'playername'
    },
    allowNull: false
  },
  // Player win loss ratio
  winLossRatio: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  // Player type
  playerType: {
    type: Sequelize.STRING(32),
    allowNull: false,
    defaultValue: 'untyped'
  },
  // Player win velocity
  winVelocity: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  // Player rank
  rank: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  // Player win streak
  winStreak: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  // Player stat createdAt time
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  // Player stat updatedAt time
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
});

//                       _             
//                      (_)            
//  ___ _   _ _ __   ___ _ _ __   __ _ 
// / __| | | | '_ \ / __| | '_ \ / _` |
// \__ \ |_| | | | | (__| | | | | (_| |
// |___/\__, |_| |_|\___|_|_| |_|\__, |
//       __/ |                    __/ |
//      |___/                    |___/ 

// Users database sync
users.sync().then(function () {
  // Users table created
  console.log('Synced to User Table');
})

// Players database sync
.then(function () {
  // Sync to database
  players.sync().then(function () {
  // Table created
  console.log('Synced to Player Table');
  });
})

// Player stats database sync
.then(function () {
  // Sync to database
  playerStats.sync().then(function () {
    // Table created
    console.log('Synced to Player Stats Table');
  });
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
// Export players
module.exports.players = players;
// Export player stats
module.exports.playerStats = playerStats;
