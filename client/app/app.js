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
          .when('/x', {
            templateUrl : 'x.html'
          })
          .when('/', {
            redirectTo: '/login'
          })
          .otherwise({template: 'Página não encontrada.'})
      }]);