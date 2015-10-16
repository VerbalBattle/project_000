angular.module('VBattle', [
'VBattle.services',
'VBattle.signin',
'VBattle.signup',
'VBattle.profile',
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
    .when('/', {
      templateUrl: '/profile/profile.html',
      controller: 'ProfileCtrl'
    })
    .otherwise('/');
});
