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
// Inclue users helper
var usersHelper = require('../db/usersHelper');
// Include config vars
var config = require('../server/serverConfig.js');
// Include authneticator
var authenticator = require('../server/authenticator');

//                  _            
//                 | |           
//  _ __ ___  _   _| |_ ___  ___ 
// | '__/ _ \| | | | __/ _ \/ __|
// | | | (_) | |_| | ||  __/\__ \
// |_|  \___/ \__,_|\__\___||___/

// POST to signup a new user
router.post('/signup', function (req, res, next) {
  // Expected request body example
  // {
  //     "username": "mike",
  //     "password": "mike"
  // }

  // Data to pass player signup
  var data = {
    // Username
    username: req.body.username,
    // Password
    password: req.body.password,
    // Callback
    callback: function (result) {
      // Send result to user
      res.send(result.encryptedStuff);
    }
  };
  // Log route called
  console.log('\n\nSIGNUP\n\n');
  // Attempt signup
  usersHelper.signup(data);

  // Expected result sent to client
  // {
  //   "signupSuccess": true,
  //   "usernameAvailable": true,
  //   "userID": 2,
  //   "username": "mike",
  //   "playersFound": false
  // }
});

// POST to login an existing user
router.post('/login', function (req, res, next) {
  // Expected request body example
  // {
  //     "username": "mike",
  //     "password": "mike"
  // }

  // Data to pass avatar login
  var data = {
    // Username
    username: req.body.username,
    // Password
    password: req.body.password,
    // Callback
    callback: function (result) {
      // Encrypt result
      result = {
        token: authenticator.createJWT(result)
      };
      // Send JWT
      res.send(result);
    }
  };
  // Log route called
  console.log('\n\nLOGIN\n\n');
  // Attempt login
  usersHelper.login(data);

  // Expected result sent to client
// {
//   "loginSuccess": true,
//   "usernameFound": true,
//   "passwordSuccess": true,
//   "userID": 1,
//   "username": "laura",
//   "avatarsFound": true,
//   "avatars": {
//     "1": {
//       "avatarName": "joey's avatar",
//       "imagePath": "../some/Image/Path.png",
//       "aboutMe": "I'm joey and I play to win.",
//       "stats": {
//         "winLossRatio": 0,
//         "avatarType": "untyped",
//         "winVelocity": 0,
//         "rank": 0,
//         "winStreak": 0
//       }
//     "6": {
//       "avatarName": "super laura",
//       "imagePath": "../some/Image/Path.png",
//       "aboutMe": "I'm laura and I play to win.",
//       "stats": {
//         "winLossRatio": 0,
//         "avatarType": "untyped",
//         "winVelocity": 0,
//         "rank": 0,
//         "winStreak": 0
//       }
//     }
//   },
//   "avatarStatsFound": true
// }
});

/*
 |--------------------------------------------------------------------------
 | Login with Twitter
 |--------------------------------------------------------------------------
 */

router.post('/auth/twitter', function (req, res) {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

  // Part 1 of 2: Initial request from Satellizer.
  if (!req.body.oauth_token || !req.body.oauth_verifier) {
    var requestTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      callback: req.body.redirectUri
    };

    // Step 1. Obtain request token for the authorization popup.
    request.post({url: requestTokenUrl, oauth: requestTokenOauth}, function (err, response, body) {
      var oauthToken = qs.parse(body);

      // Step 2. Send OAuth token back to open the authorization screen.
      res.send(oauthToken);
    });
  } else {
    // Part 2 of 2: Second request after Authorize app is clicked.
    var accessTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      token: req.body.oauth_token,
      verifier: req.body.oauth_verifier
    };

    // Step 3. Exchange oauth token and oauth verifier for access token.
    request.post({url: accessTokenUrl, oauth: accessTokenOauth}, function (err, response, accessToken) {

      accessToken = qs.parse(accessToken);

      var profileOauth = {
        consumer_key: config.TWITTER_KEY,
        consumer_secret: config.TWITTER_SECRET,
        oauth_token: accessToken.oauth_token
      };

      // Step 4. Retrieve profile information about the current user.
      request.get({
        url: profileUrl + accessToken.screen_name,
        oauth: profileOauth,
        json: true
      }, function (err, response, profile) {

        // Step 5a. Link user accounts.
        if (req.headers.authorization) {
          User.findOne({twitter: profile.id}, function (err, existingUser) {
            if (existingUser) {
              return res.status(409).send({ message: 'There is already a Twitter account that belongs to you' });
            }

            var token = req.headers.authorization.split(' ')[1];
            var payload = jwt.decode(token, config.TOKEN_SECRET);

            User.findById(payload.sub, function (err, user) {
              if (!user) {
                return res.status(400).send({message: 'User not found'});
              }

              user.twitter = profile.id;
              user.displayName = user.displayName || profile.name;
              user.picture = user.picture || profile.profile_image_url.replace('_normal', '');
              user.save(function (err) {
                res.send({token: authenticator.createJWT(user)});
              });
            });
          });
        } else {
          // Step 5b. Create a new user account or return an existing one.
          User.findOne({twitter: profile.id}, function (err, existingUser) {
            if (existingUser) {
              return res.send({ token: authenticator.createJWT(existingUser) });
            }

            var user = new User();
            user.twitter = profile.id;
            user.displayName = profile.name;
            user.picture = profile.profile_image_url.replace('_normal', '');
            user.save(function () {
              res.send({token: authenticator.createJWT(user)});
            });
          });
        }
      });
    });
  }
});

/*
 |--------------------------------------------------------------------------
 | Unlink Provider
 |--------------------------------------------------------------------------
 */
router.post('/auth/unlink', authenticator.ensureAuthenticated, function (req, res) {
  var provider = req.body.provider;
  var providers = ['facebook', 'foursquare', 'google', 'github', 'instagram',
    'linkedin', 'live', 'twitter', 'twitch', 'yahoo'];

  if (providers.indexOf(provider) === -1) {
    return res.status(400).send({message: 'Unknown OAuth Provider'});
  }

  User.findById(req.user, function (err, user) {
    if (!user) {
      return res.status(400).send({message: 'User Not Found'});
    }
    user[provider] = undefined;
    user.save(function () {
      res.status(200).end();
    });
  });
});

// POST to login an existing user
module.exports = router;
