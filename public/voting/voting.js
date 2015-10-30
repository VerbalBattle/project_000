angular.module('VBattle.voting', [])

.controller('VotingCtrl', function ($scope, $rootScope, $location, Profile, Voter) {
  //makes get request to next rooms of queue and store them in the storage
  $scope.showMessages = 1; 
  $scope.avatarOne; 
  $scope.avatarTwo;
  $scope.messages;
  $scope.roomData;
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
   // var rooms = window.localStorage["voteRooms"] || {};
    Voter.getRooms().then( function (result) {
    if (result.data[0]) {
      $scope.roomID = result.data[0].id;
      $scope.messages = result.data[0].messages;
      console.log($scope.messages);
      window.localStorage["voteRooms"] = JSON.stringify(result.data);  
      //$scope.getNext();
    }

    }) 
    .catch(function (err) {
      //console.error(err);
    });
  };

  $scope.getNext = function (avatarID) {
    //getting first room
    console.log(avatarID, "userID");
    var obj = {};
    obj.avatarID = avatarID;
    obj.roomID = $scope.roomID;

    //updates voting with put request -> roomID, user1/2
    Voter.updateStats(obj);
    //make post request to room update -> userId as an put request body
    if (window.localStorage["voteRooms"] !== "[]") {

      var rooms = JSON.parse(window.localStorage["voteRooms"]);
      console.log("parsed rooms", rooms);
      var room = rooms[Object.keys(rooms)[0]];
      $scope.avatarOne = room.avatar1.avatarID;
      $scope.avatarTwo = room.avatar2.avatarID;
      console.log("next room", room);
      if (room) {
        console.log(rooms, "out of local storage");
        $scope.messages = room.messages;
        //deleting the first room object so when another interval gets run
        //user will receive the next chatroom 
        delete rooms[Object.keys(rooms)[0]];
        console.log(rooms, "back to local storage");
        window.localStorage["voteRooms"] = JSON.stringify(rooms);
      } else {
        $scope.messages = [];
      }
    }
  };
  $scope.getVotes();
});