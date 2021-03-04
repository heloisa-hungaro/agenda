'use strict';

angular
.module('agenda')
  .controller('Login', function($scope, $rootScope, $location, AuthService) {
    $scope.user = "helo"; 
    $scope.pwd = "123";
    $rootScope.isLogged = AuthService.isLogged;
    $rootScope.userLogged = AuthService.userLogged;

    $scope.submitLogin = () => { 
      AuthService.Login($scope.user, $scope.pwd).then (function(result) {
        $rootScope.userLogged = result;
        $rootScope.isLogged = true;
        if ($rootScope.userLogged == 'Administrador') {
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