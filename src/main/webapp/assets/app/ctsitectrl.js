MetronicApp.controller('countsiteCtrl', ['locals','$stateParams','$rootScope', '$scope','$http','$state','$timeout', function(locals,$stateParams,$rootScope, $scope,$http,$state,$timeout) {
	$scope.formData={};
	$scope.pageStart = 0;
	$scope.pageSize = 20;
	$scope.addFormData=function(){
		locals.set("sitelist_cache_adverttype",$("select[name=arctype]").val());
		locals.set("sitelist_cache_begindate",$("input[name=from]").val());
		locals.set("sitelist_cache_enddate",$("input[name=to]").val());
		locals.set("sitelist_cache_pageindex",$scope.pageStart);
		locals.set("sitelist_cache_pagesize",$scope.pageSize);
	}
	$scope.search=function(){
		$scope.table.dataTable().fnDraw(false);
	}
	$scope.siteForHour=function(d,v){
		$scope.addFormData();
	   	angular.element($('#AppController')).scope().go('siteHourList',{"arcid" : v,"date" : d});
	}
	$scope.getLocals=function(){
		return locals;
	}
}]);
