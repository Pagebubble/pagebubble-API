'use strict';

angular.module('pagebubbleApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.notifications = [];

    $http.get('/api/notifications').success(function(notifications) {
      $scope.notifications = notifications;
      socket.syncUpdates('notification', $scope.notifications);
    });

    $scope.addNotification = function() {
      if($scope.newNotification === '') {
        return;
      }
      $http.post('/api/notifications', { name: $scope.newNotification });
      $scope.newNotification = '';
    };

    $scope.deleteNotification = function(notification) {
      $http.delete('/api/notifications/' + notification._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('notification');
    });
  });
