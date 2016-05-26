var ArctypeList = function () {
    var initTable = function () {
    	
        var table = $('#sampleArctype');
        var oTable = table.dataTable({
            "processing":true,
            "serverSide":true,
            "fnInitComplete":function(s){
        		$($('table.table-striped').get(0)).css('width','');
	    		$('div.dataTables_scrollHeadInner').css('width','');
        	},
            "ajax":{
                "url":"/arctype/list",
                "type":"POST",
                "data": function(param){
                    param.typename=$("#typename").val();
                }
            },
			//"bStateSave": true,
            "dom": "<'row'r>t<'row'<'col-md-2 col-sm-12'l><'col-md-3 col-sm-12'i><'col-md-7 col-sm-12'p>>", // datatable layout without  horizobtal scroll
            //"scrollY": 620,
            "scrollY": window.innerHeight - 166,
            //"fnInitComplete":function(s){
            	//console.info($($('table.table-striped').get(0)).css('width','').get(0))
            	//console.info($('div.dataTables_scrollHeadInner').css('width','').get(0))
            	//console.info($('div.dataTables_scrollHead').css('width'));
            	//console.info($('div.dataTables_scrollHead').css('width',''));
            	//console.info($('div.dataTables_scrollHead').css('width'));
        	//},
            //"deferRender": true,
            "columnDefs": [{
                "orderable": false,
                "targets": [0]
            }],
            "order": [
                [0, 'asc']
            ],
            "columns": [
                {"data": "id", "bSortable": true},
                {"data": "typename","bSortable": false},
                {"data": function(data){
                	return "<a class='btn default' onclick='toggleActInput("+data.id+")' data-toggle='modal'>修改</a>";
                },"width":100,"bSortable": false},
                {"data": function(data){
                	return "<a class='btn default' id='del' onclick='removeArctype("+data.id+")'>删除</a>";
                },"width":100,"bSortable": false}
            ],
            "lengthMenu": [
                [10, 20, 50, 100,200,500,3000],
                [10, 20, 50, 100,200,500,3000] // change per page values here
            ],
            "pageLength": 20,
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "当前没有查询到数据",
                //"info": "当前记录数： _START_ 到 _END_ 总计： _TOTAL_ ",
                "info": "当前记录数：  总计： _TOTAL_ ",
                "infoEmpty": "当前没有查询到数据",
                "infoFiltered": "(filtered1 from _MAX_ total records)",
                "lengthMenu": " _MENU_ 条",
                "paging": {
                    "previous": "上一页",
                    "next": "下一页"
                },
                "search": "Search:",
                "zeroRecords": "No matching records found"
            }
        });

        var tableColumnToggler = $('#sampleArctype_column_toggler');

        var tableWrapper = $('#sampleArctype_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown

        /* handle show/hide columns*/
        $('input[type="checkbox"]', tableColumnToggler).change(function () {
            /* Get the DataTables object again - this is not a recreation, just a get of the object */
            var iCol = parseInt($(this).attr("data-column"));
            var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
            oTable.fnSetColumnVis(iCol, (bVis ? false : true));
        });

        // Setup - add a text input to each footer cell
        /*var node1 = $('#sampleArctype_wrapper .row:eq(0)');
        var text = "<div class='row' style='padding-left: 15px;padding-right: 15px'><p>栏目名:&nbsp;&nbsp;<input type='text' name='typename' id='typename'>" +
            "&nbsp;&nbsp;&nbsp;<button type='button' class='btn green' style='float: right' onclick='actSubFrom(false)'>搜索</button>" + 
            "<span style='float: right'>&nbsp;&nbsp;&nbsp;</span>" + 
            "<a onclick='toggleActInput()'><button class='btn red' style='float: right' has-permission='arctype:query'>添加</button></a>" + 
            "<span style='float: right'>&nbsp;&nbsp;&nbsp;</span>" + 
            "<button class='btn yellow' style='float: right' data-toggle='modal' data-target='#arctypeTree'>结构图</button></p></div>";
        node1.before(text);*/
    }
    var initTree = function(){
    	$("#tree").jstree({
			"plugins" : ["themes","json_data"],
	       	"core" : {
           		"data" : {
           			"url" : "/arctype/tree"
           		}
           	},
           	"themes" : {
                    "responsive": false
                }
    	}).bind("select_node.jstree",function(e,d){
    		$('#arctypeTree').modal('hide');
    	})
    }
    
    return {
        init: function () {
            if (!jQuery().dataTable) {
                return;
            }
            initTable();
            initTree();
        }
    };
}();
function removeArctype(id){
	zzcmConfirm('确定删除吗',function(){
		$.ajax({
			url:'/arctype/delete/' + id,
			type: 'get',
			success : function(data){
				actSubFrom();
			},
			error: function(x,s){
				
			}
		});
	},'删除栏目','取消','确定');
}
function actSubFrom(keep){
	if(!keep && keep!=false){
		keep = true;
	}
	$("#sampleArctype").dataTable().fnDraw(keep);
}
var toggleActInput = function(id){
   angular.element($('#AppController')).scope().go('arctypeinput',{id:id});
}