MetronicApp.controller('AdvertCtrl', ['locals','$stateParams','$rootScope', '$scope','$http','$state','$timeout', function(locals,$stateParams,$rootScope, $scope,$http,$state,$timeout) {
	$("#ckd").html("<input type=\"checkbox\" id=\"selectAll\" />");
	$scope.formData={};
	$scope.pageStart = 0;
	$scope.pageSize = 20;
	/*$scope.columnStatus = new Array();*/
	$scope.restoreFormData=function(){
		var cacheAdvertname = locals.get("advert_cache_advertname");
		var cacheStatus = locals.get("advert_cache_status");
		var cacheAdvertposition = locals.get("advert_cache_advertposition");
		var cachePagestart = locals.get("advert_cache_pageindex");
		var cachePagesize = locals.get("advert_cache_pagesize");
		if(cacheAdvertname) $scope.formData.advertname = cacheAdvertname;
		if(cacheStatus) $scope.formData.status = cacheStatus;
		if(cacheAdvertposition) $scope.formData.advertposition = cacheAdvertposition;
		if(cachePagestart) $scope.pageStart = cachePagestart;
		if(cachePagesize) $scope.pageSize = cachePagesize;
		/*var cacheColumnstatus = locals.get("advert_cache_columnstatus");
		if(cacheColumnstatus){
			$scope.columnStatus = cacheColumnstatus.split(',');
		}*/
	}
	$scope.addFormData=function(){
		var cacheAdvertname = $scope.formData.advertname;
		var cacheStatus = $scope.formData.status;
		var cacheAdvertposition = $scope.formData.advertposition;
		if(cacheAdvertname && cacheAdvertname!='') locals.set("advert_cache_advertname",cacheAdvertname);
		if(cacheStatus && cacheStatus!='') locals.set("advert_cache_status",cacheStatus);
		if(cacheAdvertposition && cacheAdvertposition!='') locals.set("advert_cache_advertposition",cacheAdvertposition);
		locals.set("advert_cache_pageindex",$scope.pageStart);
		locals.set("advert_cache_pagesize",$scope.pageSize);
		/*locals.set("advert_cache_columnstatus",$scope.columnStatus.join());*/
	}
	$scope.restoreFormData();
	locals.clearAll();
	$scope.initTable=function () {
        var table = $('#sampleAdvert');
        var oTable = table.dataTable({
            "processing":true,
            "serverSide":true,
            "displayStart" : $scope.pageStart,
            "fnInitComplete":function(s){
	    		$($('table.table-striped').get(0)).css('width','');
	    		$('div.dataTables_scrollHeadInner').css('width','');
        	},
            "ajax":{
                "url":"/advert/list",
                "type":"POST",
                "data": function(param){
                	$scope.pageStart = param.start;
                	$scope.pageSize = param.length;
                    param.advertname=$scope.formData.advertname;
                	param.status=$scope.formData.status;
                    param.advertposition=$scope.formData.advertposition;
                }
            },
			//"bStateSave": true,
            "dom": "<'row'r>t<'row'<'col-md-2 col-sm-12'l><'col-md-3 col-sm-12'i><'col-md-7 col-sm-12'p>>", // datatable layout without  horizobtal scroll
            "scrollY": window.innerHeight - 199, 
            //"deferRender": true,
            "columnDefs": [{
                "orderable": false,
                "targets": [0]
            }],
            "order": [],
            "columns": [
            	{"data": function(data){
            		return "<input type='checkbox' name='checkList' class='checkboxes' data-set='#user_list_table .checkboxes'  value='"+data.id+"'>";
            	},"sClass": "text-center","bSortable": false,"width":20},
                {"data": "id","bSortable": false},
                {"data": "advertname","width":170,"bSortable": false},
                {"data": function(data){
                	if(data.adverttype == 0){
                		return "<a class='btn default' href='/advert/preview/"+data.id+"' target='_blank'>预览图片</a>";
                	}else if(data.adverttype == 1){
                		return "<a class='btn default' href='/advert/preview/"+data.id+"' target='_blank'>预览广告</a>";
                	}else{
                		return "";
                	}
                },"bSortable": false},
                {"data": function(data){
                	var pos = '';
                	if(data.advertposition.indexOf('1')!=-1){
                		pos += ',' + '列表1'
                	}
                	if(data.advertposition.indexOf('2')!=-1){
                		pos += ',' + '列表2'
                	}
					if(data.advertposition.indexOf('3')!=-1){
                		pos += ',' + '列表3'
                	}
                	if(data.advertposition.indexOf('4')!=-1){
                		pos += ',' + '列表4'
                	}
                	if(data.advertposition.indexOf('5')!=-1){
                		pos += ',' + '详情位1'
                	}
                	if(data.advertposition.indexOf('6')!=-1){
                		pos += ',' + '详情位2'
                	}
                	if(data.advertposition.indexOf('7')!=-1){
                		pos += ',' + '详情位3'
                	}
                	if(pos.indexOf(',')!=-1) {
                		pos = pos.substring(pos.indexOf(',') + 1);
                	}
                	return pos;
                },"bSortable": false},
                {"data": function(data){
                	if(data.status == 0) return '暂停';
                	if(data.status == 1) return '运行';
                },"width":30,"bSortable": true},
                {"data": function(data){
                	return "<a class='btn default' name='change'>修改</a>";
                	//return "<a class='btn default' name='change' onclick='toggleAdvertInput("+data.id+")'>修改</a>";
                },"bSortable": false},
                {"data": function(data){
                	return "<a class='btn default' name='del'>删除</a>";
                	//return "<a class='btn default' name='del' ng-click='removeAdvert("+data.id+")'>删除</a>";
                },"bSortable": false}
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
            	$(row).find("a[name=change]").bind('click',function(){$scope.toggleAdvertInput(data.id)});
            	$(row).find("a[name=del]").bind('click',function(){$scope.removeAdvert(data.id)});
                return row;
            }
        });
        $scope.oTable = oTable;
        var tableColumnToggler = $('#sampleAdvert_column_toggler');

        var tableWrapper = $('#sampleAdvert_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown

        var tableColumnCheckbox = $('input[type="checkbox"]', tableColumnToggler)
        /*for (var index = 0; index < $scope.columnStatus.length; index++) {
        	$(tableColumnCheckbox[$scope.columnStatus[index]]).attr('checked',false);
        	 oTable.fnSetColumnVis($scope.columnStatus[index], false);
        }*/
        tableColumnCheckbox.change(function () {
            var iCol = parseInt($(this).attr("data-column"));
            var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
            oTable.fnSetColumnVis(iCol, (bVis ? false : true));
            /*if(bVis)
            	$scope.columnStatus.push(iCol);
            else
        		$scope.columnStatus.remove(iCol);*/
        });
    }
    $scope.initEvent=function(locals){
    	$("#selectAll").click(function(){
			var ckd = this.checked;
			$('input[name=checkList]').each(function(i,v){
				this.checked = ckd;
			});
		})
    }
    
    $scope.execute=function(status) {
		var str = "";
		$('input[name="checkList"]:checked').each(function() {
			if (str == "") {
				str += $(this).val();
			} else {
				str += "," + $(this).val();
			}
		});
		if (str == "") {
			zzcmAlert("请选择需要操作的广告!");
			return;
		}
		$.ajax({
			type : "post",
			url : '/advert/execute/' + status + '/' + str,
			success : function(data) {
				$scope.search();
				jQuery.uniform.update($('#selectAll').attr('checked', false));
			}
		});
	}
	
	$scope.search=function(keep){
		if(!keep && keep!=false){
			keep = true;
		}
		//$scope.oTable.fnPageChange(1);
		$("#sampleAdvert").dataTable().fnDraw(keep);
	}
	$scope.removeAdvert=function(id){
		zzcmConfirm('确定删除吗',function(){
			$.ajax({
				url:'/advert/delete/' + id,
				type: 'get',
				success : function(data){
					$scope.search();
					jQuery.uniform.update($('#selectAll').attr('checked',false));
				},
				error: function(x,s){
				}
			});
		},'提示','取消','确定');
	}
	$scope.toggleAdvertInput=function(id){
		$scope.addFormData();
	   	angular.element($('#AppController')).scope().go('advertinput',{id:id});
	}
	$scope.initTable();
	$scope.initEvent();
}]);