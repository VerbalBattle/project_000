angular.module('VBattle.voting', [])

.controller('VotingCtrl', function ($scope, $rootScope, $location, Profile, Voter) {
  //makes get request to next rooms of queue and store them in the storage
  $scope.showMessages = 1; 
  $scope.avatarOne; 
  $scope.avatarTwo;
  //socket.emit() when need for new chats
  //socket.on() for getting latest chats -> storing them in the localstorage
  //and getting rid of them after user voted
  $scope.upvote = function (input) {
    console.log("upvoting for", input);
    //getting next messages object from local storage and removing the old one
    $scope.messages = $scope.newMessages;
  };

  $scope.getVotes = function () {
    //judging route
    var rooms = window.localStorage["voteRooms"] || {};
    Voter.getRooms().then( function (result) {
      console.log(result.data, "resultObj");
      window.localStorage["voteRooms"] = JSON.stringify(result.data);  
      //$scope.getNext();
    })
    .catch(function (err) {
      console.error(err);
    });
  };

  $scope.getNext = function (userID) {
    //getting first room
    console.log(userID, "userID");
    var obj = {};
    obj.avatarID = userID;
    obj.roomID = 10;
    console.log(userID, "voted for user");
    Voter.updateStats(obj);
    //make post request to room update -> userId as an put request body
    if (window.localStorage["voteRooms"] !== "[]") {
      var rooms = JSON.parse(window.localStorage["voteRooms"]);
      console.log("parsed rooms", rooms);
      var room = rooms[Object.keys(rooms)[0]];
      $scope.avatarOne = room.avatar2.avatarID;
      $scope.avatarTwo = room.avatar1.avatarID;
      console.log("next room", room);
      if (room) {
        console.log(rooms, "out of local storage");
        $scope.messages = room.messages;
        //deleting the first room object so when another interval gets run
        //user will receive the next chatroom 
        delete rooms[Object.keys(rooms)[0]];
        console.log(rooms, "back to local storage");
        window.localStorage["voteRooms"] = rooms;
      } else {
        $scope.messages = [];
      }
    }
  };
  $scope.getVotes();
});