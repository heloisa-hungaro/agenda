angular
  .module('agenda')
    .service('UsersService',
      function ($http, $q) {

        this.getAllUsers = function (user, pwd) {
          var deferred = $q.defer();
          var onSuccess = function (response) {
              deferred.resolve(response.data);
          }
          var onError = function (response) {
             deferred.reject(response.data.message);
          };
         
          $http({ method : 'GET', url : 'http://localhost:4000/users'})
            .then(onSuccess, onError);
          return deferred.promise;
        };

        this.delUser = function (userId) {
          var deferred = $q.defer();
          var onSuccess = function (response) {
              deferred.resolve(response.data.message);
          }
          var onError = function (response) {
             deferred.reject(response.data.message);
          };
         
          $http({ method : 'DELETE', url : `http://localhost:4000/users/${userId}`})
            .then(onSuccess, onError);
          return deferred.promise;
        };

        this.addUser = function (userData) {
          var deferred = $q.defer();
          var onSuccess = function (response) {
              deferred.resolve(response.data.message);
          }
          var onError = function (response) {
             deferred.reject(response.data.message);
          };
          const reqBody = JSON.stringify(
            { 
              'name': userData.name,
              'login': userData.login, 
              'pwd': userData.pwd,
              'permissions': {
                "add": userData.perm_add,
                "edit": userData.perm_edit,
                "del": userData.perm_del
              }
            }
          );
          $http({ method : 'POST', url : 'http://localhost:4000/users', data : reqBody, headers: {'Content-Type': 'application/json'}})
            .then(onSuccess, onError);
          return deferred.promise;
        };

        this.editUser = function (userData, userId) {
          var deferred = $q.defer();
          var onSuccess = function (response) {
              deferred.resolve(response.data.message);
          }
          var onError = function (response) {
             deferred.reject(response.data.message);
          };
          const reqBody = JSON.stringify(userData);
          $http({ method : 'PATCH', url : `http://localhost:4000/users/${userId}`, data : reqBody, headers: {'Content-Type': 'application/json'}})
            .then(onSuccess, onError);
          return deferred.promise;
        };
        
      }
    );