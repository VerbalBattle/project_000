// Master object for configuration
var configVars = {
  // TOKEN SECRET
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'Simon Says "Oh No"',
  // TWITTER KEY
  TWITTER_KEY: 'j5bkY00jkNSUAmMf4oxJK3sPx',
  // TWITTER SECRET
  TWITTER_SECRET: 'eBoVygRYDAi45UqDjxdHJZ9G3YjBv4S1DqENtOswiinniXHtBX'
};

//                             _       
//                            | |      
//   _____  ___ __   ___  _ __| |_ ___ 
//  / _ \ \/ / '_ \ / _ \| '__| __/ __|
// |  __/>  <| |_) | (_) | |  | |_\__ \
//  \___/_/\_\ .__/ \___/|_|   \__|___/
//           | |                       
//           |_|    

// Exports
module.exports = configVars;