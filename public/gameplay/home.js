angular.module('VBattle.home', [])
.controller('HomeCtrl', function ($scope, $auth, $location, toaster) {
  var user = JSON.parse(window.localStorage['user']);
  if (!user.avatars || Object.keys(user.avatars).length === 0) {
    toaster.pop({
      type: 'info',
      title: 'No avatars found',
      body: '<a href="#/profile"><div>Press HERE to create avatar</div></a>',
      bodyOutputType: 'trustedHtml',
      timeout: 5000
    });
  }
});
