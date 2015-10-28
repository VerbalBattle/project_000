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

var updateStats = function (obj) {

  return $http.put("/judging/"+obj.roomID, {upVoteID: obj.avatarID})
  .then( function (result) {
    console.log("updated room");

  })
  .catch( function (err) {
    console.error("error happened", err);
  })


};


 return {
  vote: vote,
  getRooms: getRooms,
  updateStats: updateStats
    };
});