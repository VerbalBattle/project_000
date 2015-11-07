angular.module('VBattle', [
'btford.socket-io',
'VBattle.profileServices',
'VBattle.gameplayServices',
'VBattle.home',
'VBattle.signin',
'VBattle.signout',
'VBattle.signup',
'VBattle.profile',
'VBattle.setting',
'VBattle.lobby',
'VBattle.room',
'VBattle.sideBar',
'VBattle.search',
'VBattle.matchmakerServices',
'VBattle.voting',
'VBattle.votingServices',
'satellizer',
'ui.bootstrap',
'ngRoute'
])
.config(function ($routeProvider, $httpProvider, $authProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: '/auth/signin.html',
      controller: 'SigninCtrl',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn,
        sidebarStatus: sidebarStatus
      }
    })
    .when('/signup', {
      templateUrl: '/auth/signup.html',
      controller: 'SignupCtrl',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn,
        sidebarStatus: sidebarStatus
      }
    })
    .when('/logout', {
      template: null,
      controller: 'SignoutCtrl'
    })
    .when('/', {
      templateUrl: '/gameplay/home.html',
      controller: 'HomeCtrl',
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
    .when('/rooms/:roomID/:playerID', {
      templateUrl: '/gameplay/room.html',
      controller: 'RoomCtrl',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .when('/voting', {
      templateUrl: '/voting/voting.html',
      controller: 'VotingCtrl',
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
  };

  function loginRequired ($q, $location, $auth, $rootScope, socketFactory) {
    var deferred = $q.defer();
    if ($auth.isAuthenticated()) {
      $rootScope.status = "slide";
      var mySocket = socketFactory();
      mySocket.connect();
      mySocket.emit('client:linkUser', {
        token: window.localStorage['satellizer_token']
      });
      deferred.resolve();
    } else {
      $rootScope.status = "";
      $location.path('/login');
    }
    return deferred.promise;
  };

  function sidebarStatus ($auth, $rootScope) {
    if ($auth.isAuthenticated()) {
      $rootScope.status = "slide";
    } else {
      $rootScope.status = "";
    }
  };
});
