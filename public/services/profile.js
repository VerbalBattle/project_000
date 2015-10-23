angular.module('VBattle.profileServices', [])
// Factory handling profile and avatar actions
.factory('Profile', function ($http) {
  var userData;



  var getUserFromLogin = function () {
    return $http.get('/users')
    .then(function (resp) {
      userData = resp.data;
    }, function (err) {
      throw err;
    });    
  };

  var getUser = function () {
    return userData;
  };

  var addAvatar = function (avatar) {
    return $http.post('/avatars', avatar)
      .then(function (resp) {
        return resp.data;
      }, function (err) {
        throw err;
      });
  };

  var editAvatar = function (avatarID, avatar) {

    return $http.put('/avatars/' + avatarID, avatar)
      .then(function (resp) {
        return resp.data
      }, function (err) {
        throw err;
      });
  };

  var removeAvatar = function (avatar) {
    var url = '/avatars/' + avatar.avatarID;
    return $http.delete(url, avatar)
      .then(function (resp) {
        return resp.data;
      }, function (err) {
        throw err;
      });
  };
  return {
    addAvatar: addAvatar,
    editAvatar: editAvatar,
    removeAvatar: removeAvatar,
    getUser: getUser,
    getUserFromLogin: getUserFromLogin
  };
});