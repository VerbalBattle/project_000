angular.module('VBattle.lobby', [])

.controller('LobbyCtrl', function ($scope, $location, GamePlay, Match, socketFactory) {

  var mySocket = socketFactory();
  var user = JSON.parse(window.localStorage['user']);
  mySocket.on('client:joinRoom', function (data) {

    // Get the avatarID from the data
    var avatarID = data.localAvatarID;
    // Get the roomID
    var roomID = data.roomID;

    // If the avatar belongs to us
    if (user.avatars[avatarID]) {
      // If the avatar has no rooms
      if (!user.avatars[avatarID].rooms) {
        // Initialize
        user.avatars[avatarID].rooms = {};
      }
      // Add data to avatar's rooms
      user.avatars[avatarID].rooms[roomID] = data;
      // Stringify new user data
      window.localStorage['user'] = JSON.stringify(user);
    }
  });

  
  //user.avatars at current avatarID -> rooms: add new rooms
  $scope.roomsIDs = {};

  $scope.avatars = user.avatars;

  $scope.userIDs = {};
  
  $scope.joinRoom = function (id, avID, stats) {
    //make post request to get into game with current avatar
     Match.makeGame(id, avID, stats);
    //getting stats and making post request to the server
    //make post request to get into game queue
  };
  $scope.IDs = {};

  for (var key in user.avatars) {
    console.log(user.avatars[key]);
    $scope.IDs[key] = true;
  }

  $scope.room = function (val) { 
    Match.makeGame(this.key, val.stats);
  };

  // Listener for when a finished room enters judging
  mySocket.on('client:enterJudgingUpdate', function (data) {
    console.log('judgingUpdate incoming', data);

    // Get the avatarID from the data
    var avatarID = data.avatarID;
    // Get the roomID
    var roomID = data.roomID;
    // If the avatar belongs to us
    if (user.avatars[avatarID]) {
      // If the avatar has no rooms
      if (user.avatars[avatarID].rooms) {
        // Update room as in judging
        user.avatars[avatarID].rooms[roomID].inJudging = true;
        // Stringify new user data
        window.localStorage['user'] = JSON.stringify(user);
        // Reset avatars for scope
        $scope.avatars = user.avatars;
      }
    }
  });

  // Listener for when a room has been judged
  mySocket.on('client:gameJudgedUpdate', function (data) {
    console.log('gameJudgeUpdate', data);
  });
});


//lobby -> get all avatars next to each other woth their picture and their stats
//also all their rooms -> click on that room and you will get redirected to the room
