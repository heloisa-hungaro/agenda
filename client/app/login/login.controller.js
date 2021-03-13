'use strict';

angular
.module('agenda')
  .controller('Login', function($scope, $rootScope, $location, AuthService) {
    $scope.user = "a"; 
    $scope.pwd = "123";
    $rootScope.userLogged = null;
    $rootScope.isLogged = false;

    $scope.submitLogin = () => { 
      AuthService.login($scope.user, $scope.pwd).then (function(result) {
        $rootScope.userLogged = result;
        $rootScope.isLogged = true;
        if ($rootScope.userLogged.toUpperCase() == 'ADMINISTRADOR') {
          $location.path('/users');
        } else {
          $location.path('/contacts');
        }
      }, function(error){
        //If an error happened, handle it here
        alert(error);
    });
    };
  });