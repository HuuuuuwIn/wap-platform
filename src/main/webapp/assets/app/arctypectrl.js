MetronicApp.controller('ArctypeInputController', ['$stateParams','$rootScope', '$scope','$http','$state', 'settings', function($stateParams,$rootScope, $scope,$http,$state, settings) {

    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
    	
        Metronic.initAjax();
		
        // set default layout mode
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
	//初始化为空
    $scope.formData={};
	if($stateParams.id!=null && $stateParams.id!=''){
		$http({method  : 'POST',
            url     : '/arctype/edit/' + $stateParams.id,
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data) {
        	$scope.formData = data;
    	 	angular.element($('#reidname')).html(data.retypename == null ? '顶级栏目' : data.retypename);
        }).error(function(data,header,config,status){
            console.log("error:"+JSON.stringify(data));
            console.log("header:"+header);
            console.log("config:"+config);
            console.log("status:"+JSON.stringify(status));
        });
    }
    $scope.processForm=function(){
    	$scope.formData.reid=angular.element($('#reid')).val();
        $http({method  : 'POST',
            url     : '/arctype/save',
            data    : $stateParams.id!='' ? $.param($scope.formData) : angular.element($('#arctypeForm')).serialize(),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        }).success(function(data) {
        	$state.go('arctypelist');//后面可以带参数
        }).error(function(data,header,config,status){
            console.log("error:"+JSON.stringify(data));
            console.log("header:"+header);
            console.log("config:"+config);
            console.log("status:"+JSON.stringify(status));
        });
    };
}]);