angular
  .module('agenda')
    .factory('AuthService',
      function ($http, $window) {
        var service = {};

        service.Login = function Login(user, pwd) {
          var onSuccess = function (response) {
            window.alert(JSON.stringify(response.data));
              // store token in storage to keep user logged in
              $window.sessionStorage.setItem('name',response.data.name);
              $window.sessionStorage.setItem('token',response.data.token);
              // add jwt token to auth header for all requests made by the $http service
              $http.defaults.headers.common = { 'X-Access-Token' : token };
          }
          var onError = function (response) {
            // failed login
            window.alert(response.data.message);
          };
          const reqBody = JSON.stringify({ 'login' : user, 'pwd' : pwd });
          $http({ method : 'POST', url : 'http://localhost:4000/login', data : reqBody, headers: {'Content-Type': 'application/json'}})
            .then(onSuccess, onError);
        };

        service.Logout = function Logout() {
          // remove user from storage and clear http auth header
          sessionStorage.removeItem("name");
          sessionStorage.removeItem("token");

          $http.defaults.headers.common = '';
        };
        
        return service;
      }
    );