'use strict';

angular
.module('agenda')
  .controller('Contacts', function($scope, $rootScope, $location, UsersService, AuthService) {
    if ($rootScope.isLogged == false) {
      AuthService.logout().then (function() {
        $location.path('/login');
      });
    } else {
     
    }

  });