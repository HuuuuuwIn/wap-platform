MetronicApp.directive('ctTable', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
        	var locals = scope.getLocals();
        	var cachePagestart = locals.get("sitelist_cache_pageindex");
			var cachePagesize = locals.get("sitelist_cache_pagesize");
        	if(cachePagestart) scope.pageStart = cachePagestart;
			if(cachePagesize) scope.pageSize = cachePagesize;
        	scope.table = $(elem[0]);
			scope.table.dataTable({
				"processing" : true,
				"serverSide" : true,
				"displayStart" : scope.pageStart,
				"fnInitComplete":function(s){
	    			$($('table.table-striped').get(0)).css('width','');
	    			$('div.dataTables_scrollHeadInner').css('width','');
	        	},
				"ajax" : {
					"url" : "/count/siteList",
					"type" : "POST",
					"data" : function(param) {
						scope.pageStart = param.start;
                		scope.pageSize = param.length;
						param.arctype = $("select[name=arctype]").val();
						param.beginDate = $("input[name=from]").val();
						param.endDate = $("input[name=to]").val();
					}
				},
				//"bStateSave": true,
				"dom" : "<'row'r>t<'row'<'col-md-2 col-sm-12'l><'col-md-3 col-sm-12'i><'col-md-7 col-sm-12'p>>", // datatable layout without  horizobtal scroll
				"scrollY" : window.innerHeight - 166,
				//"deferRender": true,
				"columnDefs" : [{
							"orderable" : false,
							"targets" : [0]
						}],
				"order" : [[1, 'desc']],
				"columns" : [{
							"data" : function(data){
								if(data.typename) return data.typename;
								return '未知网站名';
							},
							"bSortable" : false
						}, {
							"data" : function(data) {
								return "<a  name='showHour'>"+data.date+"</a>";
								//return "<a onclick=\"countsiteForHour('"
									//	+ data.date + "',"
										//+ data.arid + ")\">"
										//+ data.date + "</a>";
							},
							"width" : 170,
							"bSortable" : true
						}, {
							"data" : "pv",
							"bSortable" : true
						}, {
							"data" : "uv",
							"bSortable" : true
						}, {
							"data" : "ip",
							"bSortable" : true
						}],
				"lengthMenu" : [[10, 20, 50, 100, 200, 500, 3000],
						[10, 20, 50, 100, 200, 500, 3000] // change per page values here
				],
				"pageLength": scope.pageSize,
				"language" : {
					"aria" : {
						"sortAscending" : ": activate to sort column ascending",
						"sortDescending" : ": activate to sort column descending"
					},
					"emptyTable" : "当前没有查询到数据",
					"info": "当前记录数：  总计： _TOTAL_ ",
					//"info" : "当前记录数： _START_ 到 _END_ 总计： _TOTAL_ ",
					"infoEmpty" : "当前没有查询到数据",
					"infoFiltered" : "(filtered1 from _MAX_ total records)",
					"lengthMenu" : " _MENU_ 条",
					"paging" : {
						"previous" : "上一页",
						"next" : "下一页"
					},
					"search" : "Search:",
					"zeroRecords" : "No matching records found"
				},
				"createdRow": function (row,data,index) {
            	$(row).find("a[name=showHour]").bind('click',function(){scope.siteForHour(data.date,data.arid)});
                	return row;
            	}
			});
			var tableColumnToggler = $('#countsiteTable_column_toggler');
			var tableWrapper = $('#countsiteTable_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
			tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
			$('input[type="checkbox"]', tableColumnToggler).change(function() {
				var iCol = parseInt($(this).attr("data-column"));
				var bVis = scope.table.fnSettings().aoColumns[iCol].bVisible;
				scope.table.fnSetColumnVis(iCol, (bVis ? false : true));
			});
        }
    };
});

MetronicApp.directive('ctDatepicker', function() {
	return {
		restrict:'A',
		link: function(scope, elm, attr, ngModel) {
			var picker = $(elm[0]);
			if (jQuery().datepicker) {
				picker.datepicker({
					rtl : Metronic.isRTL(),
					orientation : "left",
					autoclose : true
				});
				var locals = scope.getLocals();
				var cacheBegindate = locals.get("sitelist_cache_begindate");
				var cacheEndDate = locals.get("sitelist_cache_enddate");
				if(cacheBegindate){
					$("input[name=from]").datepicker("update",cacheBegindate);
					scope.formData.begindate = cacheBegindate;
				}else{
					var yestoday = moment().add(-1,"days").format("YYYY-MM-DD");
					$("input[name=from]").datepicker("update",yestoday);
					scope.formData.begindate = yestoday;
				}
				if(cacheEndDate){
					$("input[name=to]").datepicker("update",cacheEndDate);
					scope.formData.enddate = cacheEndDate;
				}else{
					var yestoday = moment().add(-1,"days").format("YYYY-MM-DD");
					$("input[name=to]").datepicker("update",yestoday);
					scope.formData.enddate = yestoday;
				}
				locals.clear("sitelist_cache_begindate");
				locals.clear("sitelist_cache_enddate");
            //$("input[name=from]").datepicker("update",moment().add(-1,"days").format("YYYY-MM-DD"));
            //$("input[name=to]").datepicker("update",moment().add(-1,"days").format("YYYY-MM-DD"));
        	}
		}
	};
});

MetronicApp.directive('ctArctype', function() {
	return {
		restrict:'A',
		link: function(scope, elm, attr, ngModel) {
			var arctype = elm[0];
			$.ajax({
				method : "POST",
				async : false,
				url : "/article/childNodes/" + 0
			}).done(function(data) {
				$.each(data, function(i, v) {
					arctype.options.add(new Option(v.typename, v.id));
				})
				var locals = scope.getLocals();
				var cacheAdverttype = locals.get("sitelist_cache_adverttype");
				if(cacheAdverttype) {
					scope.formData.adverttype = cacheAdverttype;
					$(arctype).find("option[value="+cacheAdverttype+"]").attr("selected",true);
				}
				locals.clear("sitelist_cache_adverttype");
			});
		}
	};
});