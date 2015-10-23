angular.module('VBattle.votingServices', [])
.factory('Voter', function ($http) {

 var getRoom = function () {
  //this gets back rooms for voting
  // return $http.get('/')
  //   .then(function (resp) {
  //    return resp.data;
     
  //   }, function (err) {
  //     throw err;
  //   });   
 }

return {
  getRoom:getRoom
};

});