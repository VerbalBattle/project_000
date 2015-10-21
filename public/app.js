angular.module('VBattle', [
'VBattle.authServices',
'VBattle.profileServices',
'VBattle.gameplayServices',
'VBattle.signin',
'VBattle.signout',
'VBattle.signup',
'VBattle.profile',
'VBattle.setting',
'VBattle.battle',
'VBattle.messages',
'VBattle.sideBar',
'VBattle.search',
'ngRoute'
])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: '/auth/signin.html',
      controller: 'SigninCtrl'
    })
    .when('/signup', {
      templateUrl: '/auth/signup.html',
      controller: 'SignupCtrl'
    })
    .when('/logout', {
      template: null,
      controller: 'SignoutCtrl'
    })
    .when('/', {
      templateUrl: '/gameplay/battle.html',
      controller: 'BattleCtrl'
    })
    .when('/battle', {
      templateUrl: '/gameplay/battle.html',
      controller: 'BattleCtrl'
    })
    .when('/search', {
      templateUrl: '/social/search.html',
      controller: 'SearchCtrl'
    })
    .when('/profile', {
      templateUrl: '/profile/profile.html',
      controller: 'ProfileCtrl'
    })
    .when('/setting', {
      templateUrl: '/profile/setting.html',
      controller: 'SettingCtrl'
    })
    .when('/messages', {
      templateUrl: '/gameplay/messages.html',
      controller: 'MessageCtrl'
    })
    .otherwise('/');
});
