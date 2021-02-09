angular
  .module('agenda')
    .factory('AuthService',
      function ($http, $window) {
        var service = {};

        service.Login = function Login(user, pwd) {
          var onSuccess = function (response) {
            window.alert(JSON.stringify(response.data));
              // store token in local storage to keep user logged in between page refreshes
              //$window.sessionStorage.setItem('name',response.data.name);
              //$window.sessionStorage.setItem('token',response.data.token);
              //$localStorage.currentUser = { username: username, token: response.token };
              // add jwt token to auth header for all requests made by the $http service
              //$http.defaults.headers.common.Authorization = 'Bearer ' + response.token;
          };
          var onError = function (response) {
            window.alert(response.data.message);

            // execute callback with false to indicate failed login
          };
          const reqBody = JSON.stringify({ 'login' : user, 'pwd' : pwd });
          $http({ method : 'POST', url : 'http://localhost:4000/login', data : reqBody, headers: {'Content-Type': 'application/json'}})
            .then(onSuccess, onError);
        };

        service.Logout = function Logout() {
          window.alert( 'out');
            // remove user from local storage and clear http auth header
            //delete $localStorage.currentUser;
            //$http.defaults.headers.common.Authorization = '';
        };
        
        return service;
      }
    );