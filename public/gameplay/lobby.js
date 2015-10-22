angular.module('VBattle.lobby', [])

.controller('LobbyCtrl', function ($scope, $location, GamePlay, Auth) {
  
  var user = Auth.getUser();
  // $scope.room = 3
  // var avatar = {
  // 	rooms:[2,3,4],
  // 	aboutMe:"im funny",
  // 	image: "im an image",
  // 	avatarName: "simon"
  // };
  //  var avat = {
  // 	rooms:[2,3,4],
  // 	aboutMe:"im an idiiot",
  // 	image: "im an image",
  // 	avatarName: "peter"
  // };
  //  var avata = {
  // 	rooms:[2,3,4],
  // 	aboutMe:"im super cool",
  // 	image: "im an image",
  // 	avatarName: "sam"
  // };

  $scope.avatars = user.avatars
  
  $scope.joinRoom = function() {
  	//make post request to get into game with current avatar
  	
  }
 
 
 // $scope.messages = [];
  
  // $scope.postMessages = function (input) {
  // 	//avatar ID from localstorage?
  //   var msg = {
  //     "userID": user.userID,
  //     "avatarID": 'a',
  //     "message": input
  //   };

  //   GamePlay.postMessage(msg);
  // };

  // $scope.getMessages = function() {

  // 	$scope.messages.push(GamePlay.getMessages);

  // };
});

//lobby -> get all avatars next to each other woth their picture and their stats
//also all their rooms -> click on that room and you will get redirected to the room
