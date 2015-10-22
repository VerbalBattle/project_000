angular.module('VBattle.lobby', [])

.controller('LobbyCtrl', function ($scope, $location, GamePlay, Match, mySocket) {
  
  mySocket.on('hello', function (data) {
    console.log(data);
  });

  var user = JSON.parse(window.localStorage['user']);

  $scope.roomsIDs = {};

  $scope.avatars = user.avatars;
  
  $scope.joinRoom = function(id, avID, stats) {
  	//make post request to get into game with current avatar
     console.log("staaats", stats)
     Match.makeGame(id, avID, stats);
  	//getting stats and making post request to the server
  	//make post request to get into game queue
  };

  //make get request get messages fro all rooms right here
  // console.log("these are all rooms!!", user);

  //  for(var key in user.avatars){
  //  	for(var key in user.avatars[key].rooms){
  //  		$scope.roomsIDs[key] = true;
  //  	}
   	
  //  	// for(var key in user[key]){
  //  	// 	console.log("interesting part", user[key][key]);
  //  	// }
  //  }


  //  console.log($scope.roomsIDs);

  //  for(var id in $scope.roomsIDs){
  //    console.log(id);
     
  //  	GamePlay.getMessages(id)
  //  	.then(function(result) {
  //  		console.log("got messages for roomID", id, "messages", result);
  //  	})
  //  }
   //next step: making get request to messages with room id and find out 
   //if its your turn or not


});

//lobby -> get all avatars next to each other woth their picture and their stats
//also all their rooms -> click on that room and you will get redirected to the room
