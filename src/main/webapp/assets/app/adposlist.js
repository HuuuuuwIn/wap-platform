MetronicApp.controller('adposCtrl', ['locals','$stateParams','$rootScope', '$scope','$http','$state','$timeout', function(locals,$stateParams,$rootScope, $scope,$http,$state,$timeout) {
	$scope.formData={};
	$scope.pageStart = 0;
	$scope.pageSize = 20;
	$scope.columnStatus = new Array();
	$scope.restoreFormData=function(){
		var cachePosname = locals.get("poslist_cache_posname");
		var cacheBegindate = locals.get("poslist_cache_begindate");
		var cacheEndDate = locals.get("poslist_cache_enddate");
		var cachePagestart = locals.get("poslist_cache_pageindex");
		var cachePagesize = locals.get("poslist_cache_pagesize");
		if(cachePosname) $scope.formData.posname = cachePosname;
		if(cachePagestart) $scope.pageStart = cachePagestart;
		if(cachePagesize) $scope.pageSize = cachePagesize;
		if(cacheBegindate){
			$("input[name=from]").datepicker("update",cacheBegindate);
			$scope.formData.begindate = cacheBegindate;
		}else{
			var yestoday = moment().add(-1,"days").format("YYYY-MM-DD");
			$("input[name=from]").datepicker("update",yestoday);
			$scope.formData.begindate = yestoday;
		}
		if(cacheEndDate){
			$("input[name=to]").datepicker("update",cacheEndDate);
			$scope.formData.enddate = cacheEndDate;
		}else{
			var yestoday = moment().add(-1,"days").format("YYYY-MM-DD");
			$("input[name=to]").datepicker("update",yestoday);
			$scope.formData.enddate = yestoday;
		}
		var cacheColumnstatus = locals.get("poslist_cache_columnstatus");
		if(cacheColumnstatus){
			$scope.columnStatus = cacheColumnstatus.split(',');
		}
	}
	$scope.addFormData=function(){
		if($scope.formData.posname) locals.set("poslist_cache_posname",$scope.formData.posname);
		if($scope.formData.begindate) locals.set("poslist_cache_begindate",$("input[name=from]").val());
		if($scope.formData.enddate) locals.set("poslist_cache_enddate",$("input[name=to]").val());
		locals.set("poslist_cache_pageindex",$scope.pageStart);
		locals.set("poslist_cache_pagesize",$scope.pageSize);
		locals.set("poslist_cache_columnstatus",$scope.columnStatus.join());
	}
	$scope.handleDatePickers=function(){
		 if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                orientation: "left",
                autoclose: true
            });
        }
	}
	$scope.initTable=function(){
 	 	var table = $('#sampleAdpos');
        var oTable = table.dataTable({
            "processing":true,
            "serverSide":true,
            "displayStart" : $scope.pageStart,
            "fnInitComplete":function(s){
	    		$($('table.table-striped').get(0)).css('width','');
	    		$('div.dataTables_scrollHeadInner').css('width','');
        	},
            "ajax":{
                "url":"/count/adposlist",
                "type":"POST",
                "data": function(param){
                	$scope.pageStart = param.start;
                	$scope.pageSize = param.length;
                	param.posname=$scope.formData.posname;
                	param.beginDate=$("input[name=from]").val();
                	param.endDate=$("input[name=to]").val();
                }
            },
			//"bStateSave": true,
            "dom": "<'row'r>t<'row'<'col-md-2 col-sm-12'l><'col-md-3 col-sm-12'i><'col-md-7 col-sm-12'p>>", // datatable layout without  horizobtal scroll
            "scrollY": window.innerHeight - 166,
            //"deferRender": true,
            "columnDefs": [{
                "orderable": false,
                "targets": [0]
            }],
            "order": [
                [2, 'desc']
            ],
            "columns": [
                {"data": "advertname","bSortable": false},
                {"data": function(data){
                	return "<a name='showHour'>"+data.DATE+"</a>";
                	//return "<a onclick=\"togglePosForHour('"+data.DATE+"',"+data.dimension_one_value+")\">" +data.DATE+ "</a>";
                },"width":170,"bSortable": true},
                {"data": "shows","bSortable": true},
                {"data": "click","bSortable": true}
            ],
            "lengthMenu": [
                [10, 20, 50, 100,200,500,3000],
                [10, 20, 50, 100,200,500,3000] // change per page values here
            ],
            "pageLength": $scope.pageSize,
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "当前没有查询到数据",
                "info": "当前记录数：  总计： _TOTAL_ ",
                //"info": "当前记录数： _START_ 到 _END_ 总计： _TOTAL_ ",
                "infoEmpty": "当前没有查询到数据",
                "infoFiltered": "(filtered1 from _MAX_ total records)",
                "lengthMenu": " _MENU_ 条",
                "paging": {
                    "previous": "上一页",
                    "next": "下一页"
                },
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },
            "createdRow": function (row,data,index) {
            	$(row).find("a[name=showHour]").bind('click',function(){$scope.toggleForHour(data.DATE,data.dimension_one_value)});
                return row;
            }
        });
        var tableColumnToggler = $('#sampleAdpos_column_toggler');

        var tableWrapper = $('#sampleAdpos_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown

        var tableColumnCheckbox = $('input[type="checkbox"]', tableColumnToggler);
        for (var index = 0; index < $scope.columnStatus.length; index++) {
        	$(tableColumnCheckbox[$scope.columnStatus[index]]).attr('checked',false);
        	 oTable.fnSetColumnVis($scope.columnStatus[index], false);
        }
        tableColumnCheckbox.change(function () {
            var iCol = parseInt($(this).attr("data-column"));
            var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
            oTable.fnSetColumnVis(iCol, (bVis ? false : true));
            if(bVis)
            	$scope.columnStatus.push(iCol);
            else
        		$scope.columnStatus.remove(iCol);
        });
	}
	$scope.posFrom=function(){
		$("#sampleAdpos").dataTable().fnDraw(false)
	}
	$scope.toggleForHour=function(d,v){
		$scope.addFormData();
   		angular.element($('#AppController')).scope().go('adposlistForHour',{"date" : d,"advposid" : v});
	}
	$scope.handleDatePickers();
	$scope.restoreFormData();
	$scope.initTable();
	locals.clearAll();
}]);