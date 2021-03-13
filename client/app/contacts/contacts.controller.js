'use strict';

angular
.module('agenda')
  .controller('Contacts', function($scope, $rootScope, $location, ContactsService, AuthService) {

    let editContactId;
    $scope.editMode = false;
    $scope.editType = '';
    $scope.contactData = {};
    $scope.hoveredIndex = -1;
    

    $scope.reloadContacts = () => {
      $scope.editMode = false;
      $scope.header = 'Contatos';
      ContactsService.getSelectedContacts($scope.search).then (function(result) {
        $scope.selectedContacts = result;
      }, function(error){
        //If an error happened, handle it here
        alert(error);
      });
    }

    //on page load
    if ($rootScope.isLogged == false) {
      AuthService.logout().then (function() {
        $location.path('/login');
      });
    } else {
      $scope.reloadContacts();
    }

    // functions 

    $scope.gotoEditMode = (type, $index) => {
      $scope.editMode = true;
      $scope.editType = type;
      if (type=='add') {
        $scope.header = 'Novo Contato';
        $scope.contactData.name = '';
        $scope.contactData.address = '';
        $scope.contactData.phones = '';
        $scope.contactData.emails = '';
        $scope.contactData.notes = '';
      } else {
        $scope.header = 'Editar Contato';
        editContactId = $scope.selectedContacts[$index].id;
        $scope.contactData.name = $scope.selectedContacts[$index].name;
        $scope.contactData.address = $scope.selectedContacts[$index].address;
        $scope.contactData.phones = $scope.selectedContacts[$index].phones;
        $scope.contactData.emails = $scope.selectedContacts[$index].emails;
        $scope.contactData.notes = $scope.selectedContacts[$index].notes;
      }
    }

    
    function addContact() { 
      ContactsService.addContact($scope.contactData).then (function(result) { 
        //alert(result);
        $scope.reloadContacts();
      }, function(error){
        //If an error happened, handle it here
        alert(error);
      });
    }

    function editUser(editContactId) {
      ContactsService.editUser($scope.contactData, editContactId).then (function(result) { 
        //alert(result);
        $scope.reloadContacts();
      }, function(error){
        //If an error happened, handle it here
        alert(error);
      });
    }

    $scope.modifyUser = () => {
      if ($scope.editType=='add') {
        addContact();
      } else {
        editContact(editUserId);
      }
    }

    $scope.delContact = ($index) => { 
      if (confirm(`Deseja realmente remover o contato ${$scope.selectedContacts[$index].name} da agenda?`)) {
        ContactsService.delContact($scope.selectedContacts[$index].id).then (function(result) {
          $scope.selectedContacts.splice($index,1);  
          //alert(result);
        }, function(error){
          //If an error happened, handle it here
          alert(error);
        });
      };
    }


  });