angular.module('VBattle.voting', [])

.controller('VotingCtrl', function ($scope, $rootScope, $location, Profile, Voter) {
 

  //makes get request to next rooms of queue and store them in the storage
  //
 $scope.showMessages = 1; 

  
  //socket.emit() when need for new chats
  //socket.on() for getting latest chats -> storing them in the localstorage
  //and getting rid of them after user voted
  //zack
  $scope.upvote = function (input) {
    console.log("upvoting for", input);
    //getting next messages object from local storage and removing the old one
    $scope.messages = $scope.newMessages;
    
    $scope.users = ["peter"];
  };

  $scope.getVotes = function () {
    //judging route
    var rooms = window.localStorage["voteRooms"] || {};
    Voter.getRooms().then( function (result) {
    console.log(result.data, "resultObj")
    window.localStorage["voteRooms"] = JSON.stringify(result.data);  
      
    }) 
    .catch(function (err) {
      console.error(err);
    })

  };

  // var renderRooms = function () {
  //   var rooms = window.localStorage["voteRooms"];
  //   for (var i = 0; i<rooms.length; i++) {
  //     console.log(rooms[i].id);
  //   }

  // };

  // renderRooms();

  var getNext = function () {
   
    //getting first room
    var rooms = JSON.parse(window.localStorage["voteRooms"]);
    console.log("parsed rooms", rooms);
    var room = rooms[Object.keys(rooms)[0]];
    console.log("next room", room);
    if (room) {
    $scope.messages = room.messages;
    console.log($scope.messages);
    delete rooms[Object.keys(rooms)[0]];
    window.localStorage["voteRooms"] = rooms;
    }

  };
  
  setInterval (function () {
    getNext();
  }, 3000);
});