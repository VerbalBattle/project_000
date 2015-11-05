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
var sequelize;

//           _               
//          | |              
//  ___  ___| |_ _   _ _ __  
// / __|/ _ \ __| | | | '_ \ 
// \__ \  __/ |_| |_| | |_) |
// |___/\___|\__|\__,_| .__/ 
//                    | |    
//                    |_|    


if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    port: 5432,
    host: 'ec2-107-21-222-62.compute-1.amazonaws.com',
    logging: true //false
  });
} else {
  // the application is executed on the local machine ... use mysql
  sequelize = new Sequelize('InsultPvP', 'root', '', {
    host: 'localhost',
    // Conditional dialect
    // dialect: 'postgres',
    dialect: 'mysql',

    // disable logging; default: console.log
    logging: false
  });
}

// Setup sequelize to connect to InsultPvP database
// with root user and empty password
//var sequelize = new Sequelize('InsultPvP', 'kingsimon', '', {

               
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
    allowNull: false
  },
  // avatar image binary
  // imageSource: {
  //   type: Sequelize.BLOB('medium'),
  //   allowNull: true
  // },
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

//                   _           _____                                
//                  | |         |_   _|                               
//   __ ___   ____ _| |_ __ _ _ __| | _ __ ___   __ _  __ _  ___  ___ 
//  / _` \ \ / / _` | __/ _` | '__| || '_ ` _ \ / _` |/ _` |/ _ \/ __|
// | (_| |\ V / (_| | || (_| | | _| || | | | | | (_| | (_| |  __/\__ \
//  \__,_| \_/ \__,_|\__\__,_|_| \___/_| |_| |_|\__,_|\__, |\___||___/
//                                                     __/ |          
//                                                    |___/           

// Define avatar images model
var avatarImages = sequelize.define('avatarImages', {
  // ID
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false
  },
  // Avatar image binary
  imageSource: {
    type: Sequelize.BLOB('medium'),
    allowNull: true
  }
});

//                   _             _____ _        _       
//                  | |           /  ___| |      | |      
//   __ ___   ____ _| |_ __ _ _ __\ `--.| |_ __ _| |_ ___ 
//  / _` \ \ / / _` | __/ _` | '__|`--. \ __/ _` | __/ __|
// | (_| |\ V / (_| | || (_| | |  /\__/ / || (_| | |_\__ \
//  \__,_| \_/ \__,_|\__\__,_|_|  \____/ \__\__,_|\__|___/
                                                       
                                                       

// Define avatar stats model
var avatarStats = sequelize.define('avatarStats', {
  // FOREIGN KEY / PRIMARY KEY
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false
  },
  // Avatar winCount
  winCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  // Avatar gamesCount
  gameCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  // Avatar win loss ratio
  winLossRatio: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  // Avatar type
  avatarType: {
    type: Sequelize.STRING(32),
    allowNull: false,
    defaultValue: 'untyped'
  },
  // Avatar win velocity
  winVelocity: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  // Avatar elo (ranking score)
  elo: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1000
  },
  // Avatar win streak
  winStreak: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  // Avatar stat createdAt time
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  // Avatar stat updatedAt time
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
    allowNull: false
  },
  // Second avatar's ID
  avatar2_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  // First avatar's userID
  avatar1_userID: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  // Second avatar's userID
  avatar2_userID: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  // First avatar's votes
  avatar1_votes: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  // Second avatar's votes
  avatar2_votes: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  // Number to decide roomstate
  // 0 is active (users are playing)
  // 1 is in voting (game complete and winner is being decided)
  // 2 is closed (game completed and winner decided)
  roomState: {
    type: Sequelize.INTEGER(4),
    allowNull: false,
    defaultValue: 0
  },
  // The number of turns that have passed
  turnCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  // The avatarID of the winner
  winnerAvatarID: {
    type: Sequelize.INTEGER,
    allowNull: true
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
    allowNull: false
  },
  // Avatar id
  avatarID: {
    type: Sequelize.INTEGER,
    allowNull: false
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

  // Sync to avatar images table
  avatarImages.sync().then(function () {
    // Avatar images table created
    console.log('Synced to Avatar Images Table');

    // Sync to avatars table
    avatars.sync().then(function () {
      // Table created
      console.log('Synced to Avatar Table');

      // Sync to avatarStats table
      avatarStats.sync().then(function () {
        // Table created
        console.log('Synced to Avatar Stats Table');

        // Sync to rooms table
        rooms.sync().then(function () {
          // Table created
          console.log('Synced to Rooms Table');

          // Sync to messages
          messages.sync().then(function () {
            // Table created
            console.log('Synced to Messages Table');
          });
        });
      });
    });
  });
});

// // Avatars table sync
// .then(function () {
//   // Sync to database
//   avatars.sync().then(function () {
//     // Table created
//     console.log('Synced to avatar Table');
//   });
// })

// // Avatar stats table sync
// .then(function () {
//   // Sync to database
//   avatarStats.sync().then(function () {
//     // Table created
//     console.log('Synced to avatar Stats Table');
//   });
// })

// // Rooms table sync
// .then(function () {
//   // Sync to database
//   rooms.sync().then(function () {
//     // Table created
//     console.log('Synced to Rooms Table');
//     // Sync to database
//     messages.sync().then(function () {
//       // Table created
//       console.log('Synced to Messages Table');
//     });
//   });
// })
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
// Export avatar images
module.exports.avatarImages = avatarImages;
// Export avatar stats
module.exports.avatarStats = avatarStats;
// Export rooms
module.exports.rooms = rooms;
// Export messages
module.exports.messages = messages;