angular.module('VBattle', [
'VBattle.signin',
'VBattle.signup'
])
.config(function ($routeProvider, $httpProvider, $authProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/signin/signin.html',
      controller: 'SigninCtrl'
    })
    .when('/signup', {
      templateUrl: '/signup/signup.html',
      controller: 'SignupCtrl'
    })
    .otherwise('/');
});
