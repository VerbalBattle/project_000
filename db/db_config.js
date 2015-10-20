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
  // ID
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true
  },
  // User username
  username: {
    type: Sequelize.STRING(32),
    allowNull: false
  },
  // User password
  password: {
    type: Sequelize.STRING(60),
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

//                   _             
//                  | |            
//   __ ___   ____ _| |_ __ _ _ __ 
//  / _` \ \ / / _` | __/ _` | '__|
// | (_| |\ V / (_| | || (_| | |   
//  \__,_| \_/ \__,_|\__\__,_|_|   

// Define avatar model
var avatars = sequelize.define('avatars', {
  // ID
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true
  },
  // avatar name
  avatarName: {
    type: Sequelize.STRING(32),
    allowNull: false
  },
  // Username foreign key
  userID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  // avatar image path
  imagePath: {
    type: Sequelize.STRING(32),
    allowNull: false
  },
  // avatar about me
  aboutMe: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  // avatar createdAt time
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  // avatar updatedAt time
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
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

// Define avatar stats model
var avatarStats = sequelize.define('avatarStats', {
  // FOREIGN KEY / PRIMARY KEY
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'avatars',
      key: 'id'
    }
  },
  // avatar win loss ratio
  winLossRatio: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  // avatar type
  avatarType: {
    type: Sequelize.STRING(32),
    allowNull: false,
    defaultValue: 'untyped'
  },
  // avatar win velocity
  winVelocity: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  // avatar rank
  rank: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  // avatar win streak
  winStreak: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  // avatar stat createdAt time
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  // avatar stat updatedAt time
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
});

//  _ __ ___   ___  _ __ ___  ___ 
// | '__/ _ \ / _ \| '_ ` _ \/ __|
// | | | (_) | (_) | | | | | \__ \
// |_|  \___/ \___/|_| |_| |_|___/

// Define rooms model
var rooms = sequelize.define('rooms', {
  // First avatar's ID
  avatar1_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'avatars',
      key: 'id'
    }
  },
  // Second avatar's ID
  avatar2_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'avatars',
      key: 'id'
    }
  },
  // Boolean to decide if room is active or ready for judging
  isOpen: {
    type: Sequelize.BOOLEAN(),
    allowNull: false,
    defaultValue: true
  },
  // The number of turns that have passed
  turnCount: {
    type: Sequelize.INTEGER(),
    allowNull: false,
    defaultValue: 0
  },
  // Room createdAt time
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  // Room updatedAt time
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
});

//  _ __ ___   ___  ___ ___  __ _  __ _  ___  ___ 
// | '_ ` _ \ / _ \/ __/ __|/ _` |/ _` |/ _ \/ __|
// | | | | | |  __/\__ \__ \ (_| | (_| |  __/\__ \
// |_| |_| |_|\___||___/___/\__,_|\__, |\___||___/
//                                 __/ |          
//                                |___/           

// Define messages model
var messages = sequelize.define('messages', {
  // Room id
  roomID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'rooms',
      key: 'id'
    }
  },
  // Message
  message: {
    type: Sequelize.STRING(144),
    allowNull: false
  },
  // Room createdAt time
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  // Room updatedAt time
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

// Users table sync
users.sync().then(function () {
  // Users table created
  console.log('Synced to User Table');
})

// Avatars table sync
.then(function () {
  // Sync to database
  avatars.sync().then(function () {
    // Table created
    console.log('Synced to avatar Table');
  });
})

// Avatar stats table sync
.then(function () {
  // Sync to database
  avatarStats.sync().then(function () {
    // Table created
    console.log('Synced to avatar Stats Table');
  });
})

// Rooms table sync
.then(function () {
  // Sync to database
  rooms.sync().then(function () {
    // Table created
    console.log('Synced to Rooms Table');
  });
})

// Messages table sync
.then(function () {
  // Sync to database
  messages.sync().then(function () {
    // Table created
    console.log('Synced to Messages Table');
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
// Export avatars
module.exports.avatars = avatars;
// Export avatar stats
module.exports.avatarStats = avatarStats;
// Export rooms
module.exports.rooms = rooms;
// Export messages
module.exports.messages = messages;