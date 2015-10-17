angular.module('VBattle', [
'VBattle.services',
'VBattle.signin',
'VBattle.signout',
'VBattle.signup',
'VBattle.profile',
'VBattle.setting',
'VBattle.battle',
'VBattle.sideBar',
'VBattle.search',
'VBattle.pending',
'ngRoute'
])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: '/user/signin.html',
      controller: 'SigninCtrl'
    })
    .when('/signup', {
      templateUrl: '/user/signup.html',
      controller: 'SignupCtrl'
    })
    .when('/signout', {
      template: null,
      controller: 'SignoutCtrl'
    })
    .when('/', {
      templateUrl: '/gameplay/pending.html',
      controller: 'PendingCtrl'
    })
    .when('/battle', {
      templateUrl: '/gameplay/battle.html',
      controller: 'BattleCtrl'
    })
    .when('/search', {
      templateUrl: '/social/search.html',
      controller: 'ProfileCtrl'
    })
    .when('/profile', {
      templateUrl: '/profile/profile.html',
      controller: 'ProfileCtrl'
    })
    .when('/setting', {
      templateUrl: '/profile/setting.html',
      controller: 'SettingCtrl'
    })
    .otherwise('/');
});
