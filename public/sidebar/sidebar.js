angular.module('VBattle.sideBar', [])

.controller('SidebarCtrl', function ($scope, $location, $element, mySocket) {
  if(mySocket) {
    mySocket.emit('client:linkUser', {
      token: window.localStorage['satellizer_token']
    });
    
    mySocket.on('client:joinRoom', function (data) {
      console.log("join-room update", data);
    });
    
    mySocket.on('client:turnUpdate', function (data) {
      console.log("new message update", data);
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
    text: 'Lobby',
    route: '/lobby'
  },
  {
    status: '',
    clicked: '',
    filePath: '../assets/vote.png',
    text: 'Vote',
    route: '/voting'
  },
  {
    status: '',
    clicked: '',
    filePath: '../assets/profile.png',
    text: 'Profile',
    route: '/profile'
  },
  {
    status: '',
    clicked: '',
    filePath: '../assets/setting.png',
    text: 'Settings',
    route: '/setting'
  },
  {
    status: '',
    clicked: '',
    filePath: '../assets/logout.png',
    text: 'Logout',
    route: '/logout'
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
})

.directive('ngSidebar', function () {
  return {
    templateUrl: '/sidebar/sidebar.html',
    controller: 'SidebarCtrl'
  };
});
