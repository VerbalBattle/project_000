angular.module('VBattle.voting', [])

.controller('VotingCtrl', function ($scope, $rootScope, $location, Profile, Voter) {
 

  //makes get request to next rooms of queue and store them in the storage
  //
 $scope.showMessages = 1; 

 $scope.messages = [{sender:"simon", message:"why dont you bowen install?"}, {sender:"bowen", message:"get back eating your cake"}];
 $scope.newMessages = [{sender:"peter", message:"fuck it"}];

 $scope.users = ["simon", "bowen"];
  
  //socket.emit() when need for new chats
  //socket.on() for getting latest chats -> storing them in the localstorage
  // and getting rid of them after user voted
  $scope.upvote = function (input) {
  	console.log("upvoting for", input);
  	//getting next messages object from local storage and removing the old one
  	$scope.messages = $scope.newMessages;
  	
  	$scope.users = ["peter"];

  };




});