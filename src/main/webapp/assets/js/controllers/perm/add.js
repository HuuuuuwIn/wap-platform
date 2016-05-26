MetronicApp.controller('PermAddController', ['$rootScope', '$scope','$http','$state','$stateParams','settings', function($rootScope, $scope,$http,$state,$stateParams, settings) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        Metronic.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    var aid = $stateParams.id;
    if(null==aid || ""==aid.trim()){
        console.log("empty");
        //初始化为空
        $scope.formData={};
        $scope.isShow = false;
    }else{
        //angular.element(".page-title").html("更新")
        console.log("not empty");
        $scope.isShow = true;

        $http({url:"/perm/get.json?id="+aid,
            method:"get"
        }).success(function(data,header,config,status){
            console.log(data);
            $scope.formData = data;
            //初始化为空
            //$scope.formData={id:aid,permissionName:data.permissionName,
            //    permissionSign:data.permissionSign,description:data.description};
            angular.element("#id").val(aid);
            //$scope.isShow = true;
        }).error(function(data,header,config,status){

        })
    }

    $scope.processForm=function(){
        $http({method  : 'POST',
                url     : '/perm/save.json',
                data    : $.param($scope.formData),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        }).success(function(data) {
            console.log(data);
            if (!data.success) {
                // if not successful, bind errors to error variables
                $scope.message="success!";
                $state.go('permList');//后面可以带参数
            } else {
                // if successful, bind success message to message
                $scope.message = data.message;
            }
        }).error(function(data,header,config,status){
            console.log("error:"+JSON.stringify(data));
            console.log("header:"+header);
            console.log("config:"+config);
            console.log("status:"+JSON.stringify(status));
        });

    };

    $scope.goBack = function(){
        $state.go('permList');
    }
}]);