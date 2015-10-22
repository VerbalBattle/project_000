angular.module('VBattle', [
'VBattle.authServices',
'VBattle.profileServices',
'VBattle.gameplayServices',
'VBattle.signin',
'VBattle.signout',
'VBattle.signup',
'VBattle.profile',
'VBattle.setting',
'VBattle.lobby',
'VBattle.room',
'VBattle.sideBar',
'VBattle.search',
'satellizer',
'ngRoute'
])

.config(function ($routeProvider, $httpProvider, $authProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: '/auth/signin.html',
      controller: 'SigninCtrl',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn
      }
    })
    .when('/signup', {
      templateUrl: '/auth/signup.html',
      controller: 'SignupCtrl',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn
      }
    })
    .when('/logout', {
      template: null,
      controller: 'SignoutCtrl'
    })
    .when('/', {
      templateUrl: '/gameplay/lobby.html',
      controller: 'LobbyCtrl',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .when('/search', {
      templateUrl: '/social/search.html',
      controller: 'SearchCtrl',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .when('/profile', {
      templateUrl: '/profile/profile.html',
      controller: 'ProfileCtrl',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .when('/setting', {
      templateUrl: '/profile/setting.html',
      controller: 'SettingCtrl',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .when('/rooms/:roomID', {
      templateUrl: '/gameplay/room.html',
      controller: 'RoomCtrl',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .when('/lobby', {
      templateUrl: '/gameplay/lobby.html',
      controller: 'LobbyCtrl',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .otherwise('/');

  $authProvider.twitter({
    url: '/auth/twitter'
  });

  function skipIfLoggedIn ($q, $auth) {
    var deferred = $q.defer();
    if ($auth.isAuthenticated()) {
      deferred.reject();
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  }

  function loginRequired ($q, $location, $auth) {
    var deferred = $q.defer();
    if ($auth.isAuthenticated()) {
      deferred.resolve();
    } else {
      $location.path('/login');
    }
    return deferred.promise;
  }

});
