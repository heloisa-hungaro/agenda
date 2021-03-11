'use strict';

angular.module('agenda', ['ngRoute']);

angular
  .module('agenda')
    .config(['$routeProvider',
      function config($routeProvider) {
        $routeProvider
          .when('/login', {
            templateUrl : './login/login.html',
            controller : 'Login'
          })
          .when('/users', {
            templateUrl : './users/users.html',
            controller : 'Users'
          })
          .when('/users/add', {
            templateUrl : './users/add.html',
            controller : 'AddUser'
          })
          .when('/contacts', {
            templateUrl : './contacts/contacts.html',
            controller : 'Contacts'
          })
          .otherwise({
            redirectTo: '/login'
          });
      }])
    .run(['$rootScope', function($rootScope) {
      $rootScope.isLogged = false;
      $rootScope.userLogged = null;
      $rootScope.companyName = "Empresa";
      $rootScope.version = "1.0";
      $rootScope.yearNow = new Date();   
      $rootScope.devName = "Heloisa Hungaro"; 
    }]);