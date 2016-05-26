MetronicApp.directive('columnhourTable', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
        	scope.table = $(elem[0]);
			scope.table.dataTable({
				"processing" : true,
				"serverSide" : true,
				"fnInitComplete":function(s){
		    		$($('table.table-striped').get(0)).css('width','');
		    		$('div.dataTables_scrollHeadInner').css('width','');
	        	},
				"ajax" : {
					"url" : "/count/columnHourList",
					"type" : "POST",
					"data" : function(param) {
						param.date = scope.date;
						param.arcid = scope.arcid;
					}
				},
				//"bStateSave": true,
				"dom" : "<'row'r>t<'row'<'col-md-2 col-sm-12'l><'col-md-3 col-sm-12'i><'col-md-7 col-sm-12'p>>", // datatable layout without  horizobtal scroll
				"scrollY" : "600",
				//"deferRender": true,
				"columnDefs" : [{
							"orderable" : false,
							"targets" : [0]
						}],
				"order" : [],
				"columns" : [{
							"data" : function(data){
								if(data.pname) return data.pname;
								return '未知网站名';
							},
							"bSortable" : false
						}, {
							"data" : function(data){
								if(data.typename) return data.typename;
								return '未知网站名';
							},
							"bSortable" : false
						}, {
							"data" : "hour",
							"width" : 170,
							"bSortable" : false
						}, {
							"data" : "opens",
							"bSortable" : false
						}],
				"lengthMenu" : [[10, 20, 50, 100, 200, 500, 3000],
						[10, 20, 50, 100, 200, 500, 3000] // change per page values here
				],
				"pageLength" : 20,
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
				}
			});
			var tableColumnToggler = $('#columnhourTable_column_toggler');
			var tableWrapper = $('#columnhourTable_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
			tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
			$('input[type="checkbox"]', tableColumnToggler).change(function() {
				var iCol = parseInt($(this).attr("data-column"));
				var bVis = scope.table.fnSettings().aoColumns[iCol].bVisible;
				scope.table.fnSetColumnVis(iCol, (bVis ? false : true));
			});
        }
    };
});