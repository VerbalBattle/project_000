angular.module('VBattle.sideBar', [])

.controller('SidebarCtrl', function ($scope, $element) {
  // indicate whether sidebar is visible or not
  $scope.state = false;

  // Elements in the sidebar
  $scope.list = [
  {
    status: '',
    filePath: '../assets/battle.png',
    text: 'Find Battle',
    route: '#/battle'
  },
  {
    status: '',
    filePath: '../assets/magnify.png',
    text: 'Search User',
    route: '#/search'
  },
  {
    status: '',
    filePath: '../assets/profile.png',
    text: 'Edit Profile',
    route: '#/profile'
  },
  {
    status: '',
    filePath: '../assets/setting.png',
    text: 'Edit Settings',
    route: '#/setting'
  },
  {
    status: '',
    filePath: '../assets/logout.png',
    text: 'Logout',
    route: '#/login'
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
