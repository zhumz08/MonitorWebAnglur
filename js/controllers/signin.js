'use strict';

/* Controllers */
  // signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state','$rootScope', function($scope, $http, $state,$rootScope) {

    $scope.user = {
        hostName:"180.166.253.115",
        hostPort:"4510",
        userPwd:"0",
        userName:"1"
    };

    $scope.modalInit = function(){
    }

    $scope.authError = null;
    $scope.userLogin = function() {
      $scope.authError = null;
        try{

            var v = window.parent.frames['videoFrame'].login($scope.user);
            if(v=="OK"){
                $rootScope.userInfo = $scope.user;
                $scope.$parent.cancel();
            }else{
                $scope.authError = v;
            }

        }catch(e){
            $scope.authError("error"+e);
        }

     /* // Try to login
      $http.post('api/login', {email: $scope.user.email, password: $scope.user.password})
      .then(function(response) {
        if ( !response.data.user ) {
          $scope.authError = 'Email or Password not right';
        }else{
          $state.go('app.dashboard-v1');
        }
      }, function(x) {
        $scope.authError = 'Server Error';
      });*/
    };





  }])
;