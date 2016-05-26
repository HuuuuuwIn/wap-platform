MetronicApp.controller('AdvertInputController', ['$stateParams','$rootScope', '$scope','$http','$state', 'settings','$timeout', function($stateParams,$rootScope, $scope,$http,$state, settings,$timeout) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax();
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
	//初始化为空
    $scope.formData={};
    $scope.arcData={};
    $.ajax({
	  	method: "POST",
	  	url: "article/childNodes/0",
	  	async : false
	}).done(function(data) {
		$scope.arcData = data;
	});
    
	if($stateParams.id!=null && $stateParams.id!=''){
		$http({method  : 'POST',
            url     : '/advert/edit/' + $stateParams.id,
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data) {
        	$scope.formData = data;
        	/*if(data.adverttype == 2){
        		$scope.formData.adverttype = 1;
        		$scope.formData.jsFirm = 2;
        	}else{
        		$scope.formData.jsFirm = 1;
        	}*/
        	$.each($scope.arcData,function(i,v){
        		if($.inArray(v.id,$scope.formData.arChecked)!=-1){
        			v.checked = true;
        		}
        	});
        	angular.element($('#advertimage')).val($scope.formData.advertimage);
        	$timeout(jQuery.uniform.update, 0);
        }).error(function(data,header,config,status){
            console.log("error:"+JSON.stringify(data));
            console.log("header:"+header);
            console.log("config:"+config);
            console.log("status:"+JSON.stringify(status));
        });
    }else{
    	$scope.formData.adverttype = 0;
    	$scope.formData.checked = {4:true};
    }
    
    $scope.processForm=function(){
		var s1 = '';
		angular.forEach($scope.formData.checked,function(f,v){
			if(f){
				if(s1==''){
					s1+=v;
				}else{
					s1+=',' + v;
				}
			}
		});
		$scope.formData.advertposition = s1;
    	var s2 = '';
    	$.each($scope.arcData,function(i,v){
    		if(v.checked == true){
	    		if(s2==''){
					s2+=v.id;
				}else{
					s2+=',' + v.id;
				}
    		}
    	})
    	$scope.formData.typeid = s2;
		$scope.formData.arChecked=null;
        $http({method  : 'POST',
            url     : '/advert/save',
            data    : $.param($scope.formData),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        }).success(function(data) {
        	$state.go('advertlist');//后面可以带参数
        }).error(function(data,header,config,status){
            console.log("error:"+JSON.stringify(data));
            console.log("header:"+header);
            console.log("config:"+config);
            console.log("status:"+JSON.stringify(status));
        });
    };
}]);