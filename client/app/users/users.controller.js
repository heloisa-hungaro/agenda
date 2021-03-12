'use strict';

angular
.module('agenda')
  .controller('Users', function($scope, $rootScope, $location, UsersService, AuthService) {

    let editUserId;
    $scope.editMode = false;
    $scope.editType = '';
    $scope.userData = {};
    $scope.hoveredIndex = -1;
    

    $scope.reloadUsers = () => {
      $scope.editMode = false;
      $scope.header = 'Usuários';
      UsersService.getAllUsers().then (function(result) {
        $scope.allUsers = result;
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
      $scope.reloadUsers();
    }

    // functions 

    $scope.gotoEditMode = (type, $index) => {
      $scope.editMode = true;
      $scope.editType = type;
      if (type=='add') {
        $scope.header = 'Novo Usuário';
        $scope.userData.name = '';
        $scope.userData.login = '';
        $scope.userData.perm_add = 0;
        $scope.userData.perm_edit = 0;
        $scope.userData.perm_del = 0;
      } else {
        $scope.header = 'Editar Usuário';
        editUserId = $scope.allUsers[$index].id;
        $scope.userData.name = $scope.allUsers[$index].name;
        $scope.userData.login = $scope.allUsers[$index].login;
        $scope.userData.perm_add = $scope.allUsers[$index].perm_add;
        $scope.userData.perm_edit = $scope.allUsers[$index].perm_edit;
        $scope.userData.perm_del = $scope.allUsers[$index].perm_del;
      }
    }

    function addUser() { 
      UsersService.addUser($scope.userData).then (function(result) { 
        //alert(result);
        $scope.reloadUsers();
      }, function(error){
        //If an error happened, handle it here
        alert(error);
      });
    }

    function editUser(editUserId) { 
      let editData = $scope.userData;
      delete editData.psw;
      UsersService.editUser(editData, editUserId).then (function(result) { 
        //alert(result);
        $scope.reloadUsers();
      }, function(error){
        //If an error happened, handle it here
        alert(error);
      });
    }

    $scope.modifyUser = () => {
      if ($scope.editType=='add') {
        addUser();
      } else {
        editUser(editUserId);
      }
    }

    $scope.delUser = ($index) => { 
      if (confirm(`Deseja realmente remover o usuário ${$scope.allUsers[$index].name} (${$scope.allUsers[$index].login})?`)) {
        UsersService.delUser($scope.allUsers[$index].id).then (function(result) {
          $scope.allUsers.splice($index,1);  
          //alert(result);
        }, function(error){
          //If an error happened, handle it here
          alert(error);
        });
      };
    }

  });