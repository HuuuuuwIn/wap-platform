MetronicApp.controller('ArticleInputController', ['$stateParams','$rootScope', '$scope','$http','$state', 'settings','$timeout', function($stateParams,$rootScope, $scope,$http,$state, settings,$timeout) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax();
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
	//初始化为空
    $scope.formData={};
    $.ajax({
	  	method: "POST",
	  	url: '/article/edit/' + $stateParams.id,
	  	async : false
	}).done(function(data) {
		$scope.formData = data;
	});
    $scope.processForm=function(){
    	if($scope.formData.flag){
    		$scope.formData.flag = 1;
    	}else{
    		$scope.formData.flag = 0;
    	}
        $http({method  : 'POST',
            url     : '/article/save',
            data    : $.param($scope.formData),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        }).success(function(data) {
        	$state.go('articlelist');//后面可以带参数
        }).error(function(data,header,config,status){
        });
    };
    $scope.isChecked=$scope.formData.flag == 1? true : false;
}]);