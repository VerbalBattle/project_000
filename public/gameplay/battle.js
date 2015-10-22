angular.module('VBattle.battle', [])

.controller('BattleCtrl', function ($scope, $location, Auth, GamePlay) {
  
  $scope.startGame = function () {
    $scope.user = Auth.getUser();
    GamePlay.startGame($scope.user.userID)
    .then(function (data) {
      console.log(data);
    });
  };



  $scope.getPendingGames = function () {
    
  };
});



// render messages from that room 
//maybe profile views with avatars and stats

    

