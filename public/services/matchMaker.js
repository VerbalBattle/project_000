angular.module('VBattle.matchmakerServices', [])
// Factory handling game play, including room creation and post/get messages
.factory('Match', function ($http) {
  // Get all rooms that are completed and ready for voting, expects result to be the oldest room
   
   var makeGame = function (avID, avatarStats) {

    var match = {avatarID: avID, avatarStats:avatarStats};
     
     return $http.post("/matchmaking", match)
      .then(function (resp) {
        console.log("success, sent:", match);
        return resp.data;
      }, function (err) {
        throw err;
      });
    };
 
 return {
  
  makeGame:makeGame
 }


});