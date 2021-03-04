'use strict';

angular
.module('agenda')
  .controller('Logout', function($scope, $rootScope, $location, AuthService) {
    $scope.submitLogout = () => { 
      AuthService.logout().then (function() {
        $rootScope.isLogged = false;
        $rootScope.userLogged = null; 
        $location.path('/login');
      });
    };
  });