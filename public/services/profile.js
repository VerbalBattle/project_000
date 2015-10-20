angular.module('VBattle.profileServices', [])
// Factory handling profile and avatar actions
.factory('Profile', function ($http) {
  var getAvatars = function (userId) {
    
  };
  
  var addAvatar = function (avatar) {
    return $http.post('/avatars', avatar)
      .then(function (resp) {
        return resp.data;
      }, function (err) {
        throw err;
      });
  };

  var removeAvatar = function (avatar) {
    var url = '/avatars/' + avatar.userID + '/' + avatar.avatarID;
    return $http.delete(url, avatar)
      .then(function (resp) {
        return resp.data;
      }, function (err) {
        throw err;
      });
  };
  return {
    addAvatar: addAvatar,
    removeAvatar: removeAvatar
  };
});