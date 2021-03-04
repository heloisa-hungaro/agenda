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
        
      }
    );