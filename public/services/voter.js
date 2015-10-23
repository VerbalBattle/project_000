angular.module('VBattle.votingServices', [])
.factory('Voter', function ($http) {

 var vote = function (roomsID, avatarID) {
  //this gets back rooms for voting
  // return $http.get('/')
  //   .then(function (resp) {
  //    return resp.data;
     
  //   }, function (err) {
  //     throw err;
  //   });   
  //sending and upvote to the server with the from the user selected winner
return $http.put('/voting/'+roomsID, {winner: avatarID})
.then(function (result) {
	return result.data;
 }, function(err) {
	throw err;
})
 }

return {
  vote:vote
};

});