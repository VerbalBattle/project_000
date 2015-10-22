angular.module('VBattle.room', [])

.controller('RoomCtrl', function ($timeout, $scope, $location, $routeParams, GamePlay) {
  
  var user = JSON.parse(window.localStorage['user']);
  var userid = user.userID;
  var avatarID = Number($routeParams.playerID);
  $scope.messages;
  var room = $routeParams.roomID;
  $scope.shower = false;
  $scope.enemy;

  
  
  $scope.postMessage = function (text) {
   //getting userID and avatarID form localstorage
   //replace roomID with variable room
    var msg = {
      "userID": userid,
      "avatarID": avatarID,
      "message": text,
      "roomID": room
    };
    console.log(msg)

    //{
  //     "userID": 17,
  //     "avatarID": 23,
  //     "message": "my message is here"
  // }

    GamePlay.postMessage(msg)
    .then(function(result) {
    	console.log("message sent", result.turnValid)
    
    if(result.turnValid === false){
    	$scope.shower = true;
    	$timeout(function() {
    		$scope.shower = false;
    		console.log("setting to true");
    	}, 2000);

    	
    	}
    	$timeout(function() {
    		$scope.getMessages();
    	}, 20)


    });
    $scope.input = "";
  };

  $scope.getMessages = function() {

  // $scope.messages.push(GamePlay.getMessages(1).rooms[1].messages);
  console.log("getting messages")
  //console.log(GamePlay.getMessages(1).rooms[1].messages, "heleelelellelel")
   GamePlay.getMessages(room)
   .then(function(result){

   	console.log("messagesssjijuhu", result.rooms);

   	// for(var key in result.rooms) {
   	// avatarID = result.rooms[key].avatar2_id;
   	// console.log("fialure here")
   	// }
   	//getting playerID
   $scope.enemy = result.rooms[room].avatar2_id;
   console.log("attantion");
   console.log($scope.enemy)
   	$scope.messages = result.rooms;
   }) 

  };

  $scope.getMessages();
});