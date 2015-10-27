angular.module('VBattle.votingServices', [])
.factory('Voter', function ($http) {

 var vote = function (roomsID, avatarID) {
  return $http.put('/voting/' + roomsID, {winner: avatarID})
    .then(function (result) {
      return result.data;
    }, function (err) {
      throw err;
    });

};

var getRooms = function () {
  return $http.get('/judging');

};


 return {
  vote: vote,
  getRooms: getRooms
    };
});