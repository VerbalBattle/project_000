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
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('./serverConfig');

// Authenticator master object
var authenticator = {};

// Authenticator method to ensure token is authenticated
authenticator.ensureAuthenticated = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.headers.authorization.split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  // req.user = payload.sub;
  // console.log(payload.sub);
  req.body.decrypted = payload.sub;
  next();
};

// Authenticator method to decode token without body
// NOTE (only called AFTER a user is authenticated)
authenticator.decodeToken = function (token) {
  var result = jwt.decode(token, config.TOKEN_SECRET).sub;
  return result;
};

// Authenticator JWT token generator
authenticator.createJWT = function (data) {
  var payload = {
    // sub: user._id,
    sub: data,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
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
module.exports = authenticator;
