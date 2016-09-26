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
            $rootScope.user = $scope.user;

            $state.go("monitorweb.video");

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

    $scope.loginServer = function(){
        $scope.authError = null;

        try{
            userKey = commonOcxObj.Initialize(0);
            var r = commonOcxObj.ConnectToServer(userKey, $scope.user.hostName, $scope.user.hostPort);
            if(r==0){
                var retVal = commonOcxObj.UserLogin(userKey, $scope.user.userName, $scope.user.userPwd);
               /// alert("retVal:" + retVal);

                if(retVal==0){
                    $("#loginDiv").addClass("hidden");
                    $("#videoDiv").removeClass("hidden");
                    $("#toolBar").removeClass("hidden");
                }
            }
        }catch(e){
            ///alert("EEEEEEE" + e);
          $scope.authError = "login error" + e;
        }


    }


  }])
;