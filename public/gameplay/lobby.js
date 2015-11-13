angular.module('VBattle.lobby', [])

.controller('LobbyCtrl', function ($scope, $location, GamePlay, Match, socketFactory, toaster) {

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
      // Increment avatar game count
      ++user.avatars[avatarID].gameCount;
      console.log(user.avatars[avatarID]);
      // Reset avatars
      $scope.avatars = user.avatars;
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
    // Handoff stats
    Match.makeGame(this.key, val.stats);
  };

  // Listener for when a room turn is switched
  mySocket.on('client:turnUpdate', function (data) {

    // Get the avatarID
    var avatarID = data.rooms[Object.keys(data.rooms)[0]]
        .avatar1.avatarID;
    // If the avatar is in avatars
    if (!user.avatars[avatarID]) {
      // Set avatarID to be avatar2
      avatarID = data.rooms[Object.keys(data.rooms)[0]]
        .avatar2.avatarID;
    }

    // If the avatar is in avatars
    if (user.avatars[avatarID]) {
      // Get roomID
      var roomID = Object.keys(data.rooms)[0];
      // Flip turn bool
      var turn = user.avatars[avatarID].rooms[roomID].canTakeTurn;
      user.avatars[avatarID].rooms[roomID].canTakeTurn = !turn;
      // Update local storage
      window.localStorage['user'] = JSON.stringify(user);
      // Reset avatars for scope
      $scope.avatars = user.avatars;
    }

    if (!data.isSender) {
      toaster.pop({
        type: 'info',
        title: 'Received new message from ' + opponentName + '.',
        body: '<a href="#/rooms/' + roomID + '/' + avatarID + '"><div>Go to Room' + roomID + '</div></a>',
        bodyOutputType: 'trustedHtml',
        timeout: 5000
      });
    }
  });

  // Listener for when a finished room enters judging
  mySocket.on('client:enterJudgingUpdate', function (data) {

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

    // Check if avatar is in users
    if (user.avatars[data.avatarID]) {
      console.log('made it 1');
      // Check if room in avatar's rooms
      if (user.avatars[data.avatarID].rooms[data.roomID]) {
        console.log('made it 2');

        // Mark room as closed
        user.avatars[data.avatarID]
          .rooms[data.roomID].inJudging = true;
        user.avatars[data.avatarID]
          .rooms[data.roomID].isJudged = true;

        // Get stats
        var currStats = user.avatars[data.avatarID].stats;

        // Set new stats
        currStats['Elo'] = data.avatarStats.elo;
        currStats['Avatar Type'] = data.avatarStats.avatarType;
        currStats['Win/Loss Ratio'] = data.avatarStats.winLossRatio;
        currStats['Win Streak'] = data.avatarStats.winStreak;

        // Stringify new user data
        window.localStorage['user'] = JSON.stringify(user);
        // Reset avatars for scope
        $scope.avatars = user.avatars;
      }
    }
  });
});


//lobby -> get all avatars next to each other woth their picture and their stats
//also all their rooms -> click on that room and you will get redirected to the room
