angular.module('VBattle', [
'VBattle.signin',
'VBattle.signup',
'ngRoute'
])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider

    .when('/', {
      templateUrl: '/user/signin.html',
      controller: 'SigninCtrl'
    })
    .when('/signup', {
      templateUrl: '/user/signup.html',
      controller: 'SignupCtrl'
    })
    .otherwise('/');
});
