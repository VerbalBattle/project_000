angular.module('VBattle.sideBar', [])

.controller('SidebarCtrl', function ($scope, $element, mySocket) {

  if (!mySocket.alreadyCreated) {
    mySocket.connect();
    mySocket.emit('client:linkUser', {token: window.localStorage['satellizer_token']});
    mySocket.on('client:joinRoom', function (data) {
      console.log("join-room update", data);
    });
    mySocket.on('client:turnUpdate', function (data) {
      console.log("new message update", data);
    });
    mySocket.alreadyCreated = true;
  }


  // indicate whether sidebar is visible or not
  $scope.state = false;

  // Elements in the sidebar
  $scope.list = [
  {
    status: '',
    filePath: '../assets/lobby.png',
    text: 'Lobby',
    route: '#/lobby'
  },
  {
    status: '',
    filePath: '../assets/vote.png',
    text: 'Vote',
    route: '#/voting'
  },
  {
    status: '',
    filePath: '../assets/profile.png',
    text: 'Profile',
    route: '#/profile'
  },
  {
    status: '',
    filePath: '../assets/setting.png',
    text: 'Settings',
    route: '#/setting'
  },
  {
    status: '',
    filePath: '../assets/logout.png',
    text: 'Logout',
    route: '#/logout'
  }
  ];

  // Change classname for tag with specific ID
  $scope.showText = function (index) {
    $scope.list[index].status = 'show';
  };

  $scope.hideText = function (index) {
    $scope.list[index].status = '';
  };
})

.directive('ngSidebar', function () {
  return {
    templateUrl: '/sidebar/sidebar.html',
    controller: 'SidebarCtrl'
  };
});
