angular.module('VBattle.sideBar', [])

.controller('SidebarCtrl', function ($auth, $scope, $location, $element, socketFactory) {
  if ($auth.isAuthenticated()) {
    var mySocket = socketFactory();
    mySocket.emit('client:linkUser', {
      token: window.localStorage['satellizer_token']
    });                                                             
  }

  // indicate whether sidebar is visible or not
  $scope.state = false;

  // Elements in the sidebar
  $scope.list = [
    {
      status: '',
      clicked: '',
      filePath: '../assets/lobby.png',
      text: 'Home',
      route: '/lobby',
      glyphicon: 'glyphicon glyphicon-home'
    },
    {
      status: '',
      clicked: '',
      filePath: '../assets/vote.png',
      text: 'Vote',
      route: '/voting',
      glyphicon: 'glyphicon glyphicon-flag'
    },
    {
      status: '',
      clicked: '',
      filePath: '../assets/profile.png',
      text: 'Profile',
      route: '/profile',
      glyphicon: 'glyphicon glyphicon-user'
    },
    {
      status: '',
      clicked: '',
      filePath: '../assets/logout.png',
      text: 'Logout',
      route: '/logout',
      glyphicon: 'glyphicon glyphicon-road'
    }
  ];

  // Change classname for tag with specific ID
  $scope.showText = function (index) {
    $scope.list[index].status = 'show';
  };

  $scope.hideText = function (index) {
    $scope.list[index].status = '';
  };
  $scope.clickButton = function (index) {
    for (var i = 0; i < $scope.list.length; i++) {
      $scope.list[i].clicked = '';
    }
    if (index !== $scope.list.length - 1) {
      $scope.list[index].clicked = 'selected';
    }
    $location.path($scope.list[index].route);
  };

  // Listener for onlinePlayerCount
  mySocket.on('client:onlinePlayerCount', function (data) {
    console.log(data);
  });
})

.directive('ngSidebar', function () {
  return {
    templateUrl: '/sidebar/sidebar.html',
    controller: 'SidebarCtrl'
  };
});
