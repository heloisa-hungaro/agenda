'use strict';

angular
.module('agenda')
  .controller('Login', function($scope, AuthService) {
    $scope.user = "novo";
    $scope.pwd = "abc";
    $scope.submitLogin = () => { AuthService.Logout($scope.user, $scope.pwd); };
  });