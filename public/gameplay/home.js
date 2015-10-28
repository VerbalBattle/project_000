angular.module('VBattle.home', [])
.controller('HomeCtrl', function ($scope, $auth, $location, mySocket) {
  // connect socket
  mySocket.connect();
  mySocket.emit('client:linkUser', {
    token: window.localStorage['satellizer_token']
  });
});
