MetronicApp.controller('columnCtrl', ['locals','$stateParams','$rootScope', '$scope','$http','$state','$timeout', function(locals,$stateParams,$rootScope, $scope,$http,$state,$timeout) {
	$scope.search=function(){
		$scope.table.dataTable().fnDraw(false)
	}
	$scope.formData={};
	$scope.pageStart = 0;
	$scope.pageSize = 20;
	$scope.addFormData=function(){
		locals.set("columnlist_cache_firsttype",$("select[name=firstType]").val());
		locals.set("columnlist_cache_secondtype",$("select[name=secondType]").val());
		locals.set("columnlist_cache_begindate",$("input[name=from]").val());
		locals.set("columnlist_cache_enddate",$("input[name=to]").val());
		locals.set("columnlist_cache_pageindex",$scope.pageStart);
		locals.set("columnlist_cache_pagesize",$scope.pageSize);
	}
	$scope.getLocals=function(){
		return locals;
	}
	$scope.getChildNodes=function(pid,sub){
    	$.ajax({
		  method: "get",
		  async : false,
		  url: "/article/childNodes/" + pid
		}).done(function(data) {
			$(sub).removeAttr("disabled");
			sub.options.length = 0;
			sub.options.add(new Option("全部",""));
			$.each(data,function(i,v){
				sub.options.add(new Option(v.typename,v.id));
			});
		});
	}
	$scope.countcolumnForHour=function(d,v){
		$scope.addFormData();
	   	angular.element($('#AppController')).scope().go('columnHourList',{"arcid" : v,"date" : d});
	}
}]);
