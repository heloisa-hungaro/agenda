'use strict';

angular
.module('agenda')
  .controller('Users', function($scope, $rootScope, $location, UsersService, AuthService) {
    if ($rootScope.isLogged == false) {
      AuthService.logout().then (function() {
        $location.path('/login');
      });
    } else {
      UsersService.getAllUsers().then (function(result) {
        $scope.allUsers = result;
      }, function(error){
        //If an error happened, handle it here
        alert(error);
      });
    }

  });