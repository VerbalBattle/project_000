angular.module('VBattle.gameplayServices', [])
// Factory handling game play, including room creation and post/get messages
.factory('GamePlay', function ($http) {
  // Get all rooms that are completed and ready for voting, expects result to be the oldest room
  var getGames = function () {

    return $http.get('/rooms')
      .then(function (resp) {
        return resp.data;
      }, function (err) {
        throw err;
      });
  };
  // Post user data to matchmaking queue and expects a filled room
  var startGame = function (user) {

    return $http.post('/matchmaking', user)
      .then(function (resp) {
        return resp.data;
      }, function (err) {
        throw err;
      });
  };
  // Get room based on roomID
  var getMessages = function (roomID) {

    return $http.get('/rooms/' + roomID)
      .then(function (resp) {
        //console.log("messages received", resp.data.rooms[1].messages);
        return resp.data;
      }, function (err) {
        throw err;
      });
  };

  // Post a message to a room by ID
  var postMessage = function(messageData) {
    var roomID = messageData.roomID;
    //will work when room exists
    return $http.post('/rooms/'+roomID, messageData)
     .then(function(resp) {
       return resp.data;
    }, function(err) {
       throw err;
    });
 };

  return {
    getGames: getGames,
    startGame: startGame,
    getMessages: getMessages,
    postMessage: postMessage
  };
});