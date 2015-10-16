angular.module('VBattle.sideBar', [])

.controller('SidebarCtrl', function($scope) {
  
  $scope.state = false;
  
  $scope.toggleState = function() {
    $scope.state = !$scope.state;
  };
  
})

.directive('sidebarDirective', function() {
  return {
    link : function(scope, element, attr) {
      scope.$watch(attr.sidebarDirective, function(newVal) {
          if(newVal)
          {
          element.addClass('show'); 
          return;
          }
          element.removeClass('show');
      });
    }
  };
});
