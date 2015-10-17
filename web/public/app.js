angular.module('VBattle', [
'VBattle.services',
'VBattle.signin',
'VBattle.signout',
'VBattle.signup',
'VBattle.profile',
'VBattle.sideBar',
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
      templateUrl: '/profile/profile.html',
      controller: 'ProfileCtrl'
    })
    .otherwise('/');
});
