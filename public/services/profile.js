angular.module('VBattle.profileServices', [])
// Factory handling profile and avatar actions
.factory('Profile', function ($http) {
  // User data for local storage
  var userData;

  // Edit login data
  var modifyLoginData = function () {

    // Identify our avatar as avatar1 or avatar2
    // in each game room

    // Iterate over all avatars in login data
    var avatars = userData.avatars;
    for (var avatarID in avatars) {

      // Get current avatar
      var currAvatar = avatars[avatarID];
      // Iterate over avatar's rooms
      var currStats = currAvatar.stats;
      // Un-camelCase stats
      currStats['Elo'] = currStats.elo;
      delete currStats.elo;
      currStats['Avatar Type'] = currStats.avatarType;
      delete currStats.avatarType;
      currStats['Win/Loss Ratio'] = currStats.winLossRatio;
      delete currStats.winLossRatio;
      currStats['Win Streak'] = currStats.winStreak;
      delete currStats.winStreak;

      // Iterate over the rooms the avatar has
      for (var roomID in currAvatar.rooms) {
        currAvatar.rooms[roomID].inJudging = false;
      }
      // Set gameCount since Object.keys() is not
      // accessible on DOM through angular
      currAvatar.gameCount =
        (currAvatar.rooms ? Object.keys(currAvatar.rooms).length : 0);
    }
  };

  // Get all login data from user
  var getUserFromLogin = function () {
    return $http.get('/users')
    .then(function (resp) {
      // Set login data
      userData = resp.data;
      // Edit/process login data for frontend
      modifyLoginData();
    }, function (err) {
      throw err;
    });
  };


  // Return user data
  var getUser = function () {
    console.log('user data', userData);
    return userData;
  };

  // Send new avatar to server
  var addAvatar = function (avatar) {
    return $http.post('/avatars', avatar)
      .then(function (resp) {
        return resp.data;
      }, function (err) {
        throw err;
      });
  };

  // Send avatar changes to server
  var editAvatar = function (avatarID, avatar) {
    return $http.put('/avatars/' + avatarID, avatar)
      .then(function (resp) {
        return resp.data;
      }, function (err) {
        throw err;
      });
  };

  // Remove avatar from user's account
  var removeAvatar = function (avatar) {
    var url = '/avatars/' + avatar.avatarID;
    return $http.delete(url, avatar)
      .then(function (resp) {
        return resp.data;
      }, function (err) {
        throw err;
      });
  };

  // Return factory methods
  return {
    addAvatar: addAvatar,
    editAvatar: editAvatar,
    removeAvatar: removeAvatar,
    getUser: getUser,
    getUserFromLogin: getUserFromLogin
  };
});