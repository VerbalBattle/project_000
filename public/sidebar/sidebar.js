angular.module('VBattle.sideBar', [])

.controller('SidebarCtrl', function ($scope, $element) {
  // indicate whether sidebar is visible or not
  $scope.state = false;

  // Elements in the sidebar
  $scope.list = [
  {
    status: '',
    filePath: '../assets/battle.png',
    text: 'Lobby',
    route: '#/battle'
  },
  {
    status: '',
    filePath: '../assets/message.png',
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
