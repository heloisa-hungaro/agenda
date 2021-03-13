angular
  .module('agenda')
    .service('ContactsService',
      function ($http, $q) {

        this.getSelectedContacts = function (search) {
          var deferred = $q.defer();
          var onSuccess = function (response) {
              deferred.resolve(response.data);
          }
          var onError = function (response) {
             deferred.reject(response.data.message);
          };
         
          $http({ method : 'GET', url : `http://localhost:4000/contacts?name=${search}`})
            .then(onSuccess, onError);
          return deferred.promise;
        };

        this.delContact = function (contactId) {
          var deferred = $q.defer();
          var onSuccess = function (response) {
              deferred.resolve(response.data.message);
          }
          var onError = function (response) {
             deferred.reject(response.data.message);
          };
         
          $http({ method : 'DELETE', url : `http://localhost:4000/contacts/${contactsId}`})
            .then(onSuccess, onError);
          return deferred.promise;
        };

        this.addContact = function (contactData) {
          var deferred = $q.defer();
          var onSuccess = function (response) {
              deferred.resolve(response.data.message);
          }
          var onError = function (response) {
             deferred.reject(response.data.message);
          };
          const reqBody = JSON.stringify(
            { 
              'name': contactData.name,
              'address': contactData.address, 
              'phones': contactData.phones,
              'emails': contactData.emails,
              'notes': contactData.notes
            }
          );
          $http({ method : 'POST', url : 'http://localhost:4000/contacts', data : reqBody, headers: {'Content-Type': 'application/json'}})
            .then(onSuccess, onError);
          return deferred.promise;
        };

        this.editContact = function (contactData, contactId) {
          var deferred = $q.defer();
          var onSuccess = function (response) {
              deferred.resolve(response.data.message);
          }
          var onError = function (response) {
             deferred.reject(response.data.message);
          };
          const reqBody = JSON.stringify(contactData);
          $http({ method : 'PATCH', url : `http://localhost:4000/contacts/${contactId}`, data : reqBody, headers: {'Content-Type': 'application/json'}})
            .then(onSuccess, onError);
          return deferred.promise;
        };
        
      }
    );