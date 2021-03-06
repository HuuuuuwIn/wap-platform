MetronicApp.controller('CountryAddController', ['$rootScope', '$scope','$http','$state', 'settings', function($rootScope, $scope,$http,$state, settings) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        Metronic.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    //初始化为空
    $scope.formData={};

    $scope.processForm=function(){
        $http({method  : 'POST',
                url     : '/country/save.json',
                data    : $.param($scope.formData),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        }).success(function(data) {
            console.log(data);
            if (!data.success) {
                // if not successful, bind errors to error variables
                $scope.message="success!";
                $state.go('country2');//后面可以带参数
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

}]);