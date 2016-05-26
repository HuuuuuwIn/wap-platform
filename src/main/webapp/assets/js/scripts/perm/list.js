var PermList = function () {

    var initTable = function () {
    	$("#ckd").html("<input type=\"checkbox\" class=\"group-checkable\" id=\"selectAll\" data-set=\"#perm_list_table .checkboxes\"/>");
        var table = $('#perm_list_table');

        table.dataTable({
            "processing":true,
            "serverSide":true,
            "ajax":{
                "url":"/perm/list",
                "type":"POST",
                "data": function(permission){
                    permission.permissionName=$("#name").val();
                    permission.permissionSign=$("#sign").val();
                }
            },
            "columns": [
                {data:"id",render:function(data,type,full){
                    return "<input type='checkbox' name='checkList' class='checkboxes' data-set='#perm_list_table .checkboxes'  value='"+data+"'>"
                },"sClass": "text-center","bSortable": false},
                {"data": "id", "bSortable": true},
                {"data": "permissionName"},
                {"data": "permissionSign"},
                {"data": "description"}
            ],
            "scrollY": window.innerHeight - 165, 
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "当前没有查询到数据",
                "info": "",
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

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

            //"bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.
            "dom": "<'row'r>t<'row'<'col-md-2 col-sm-12'l><'col-md-3 col-sm-12'i><'col-md-7 col-sm-12'p>>", // datatable layout without  horizobtal scroll
            "lengthMenu": [
                [5, 10, 20, -1],
                [5, 10, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": 10,
            "columnDefs": [{  // set default column settings
                'orderable': false,
                'targets': [0]
            }, {
                "searchable": false,
                "targets": [0]
            }],
            "order": [
                [1, "asc"]
            ] // set first column as a default sort by asc
        });

        var tableWrapper = jQuery('#perm_list_table_wrapper');

        $('.group-checkable').click(function () {
            var set = jQuery(this).attr("data-set");
            var checked = jQuery(this).is(":checked");
            jQuery(set).each(function () {
                if (checked) {
                    $(this).attr("checked", true);
                } else {
                    $(this).attr("checked", false);
                }
            });
            //var check = $(this).prop("checked");
            //$("#perm_list_table .checkboxes").prop("checked", check);
            jQuery.uniform.update(set);
        });

        var tableColumnToggler = $('#sample_column_toggler');
        /* handle show/hide columns*/
        $('input[type="checkbox"]', tableColumnToggler).change(function () {
            /* Get the DataTables object again - this is not a recreation, just a get of the object */
            var iCol = parseInt($(this).attr("data-column"));
            var bVis = table.fnSettings().aoColumns[iCol].bVisible;
            table.fnSetColumnVis(iCol, (bVis ? false : true));
        });

        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown

        //var node1 = $('#perm_list_table_wrapper .row:eq(0)');
        //var text = "<div class='row' style='padding-left: 15px;padding-right: 15px'><p>" +
        //  "权限名称<input type='text' name='permissionName' id='name'>&nbsp;&nbsp;&nbsp;" +
        //    "权限标识<input type='text' name='permissionSign' id='sign'>" +
          //  "<button type='submit' class='btn green' style='float: right' id='subBtn'>搜索</button></p></div> "

        //node1.before(text);

        $("#subBtn").click(function(){
            table._fnAjaxUpdate();
        })

        $("#delete").click(function(){
            //angular.element($('#AppController')).scope().go('userUpdate',{id:"sssssss"});
            if($("#perm_list_table .checkboxes:checked").length==0){
                zzcmAlert("请选择一条数据");
                return;
            }

            if ($("#perm_list_table .checkboxes:checked").length > 1){
                zzcmAlert("一次只能修改一条数据");
                return;
            }

            var id = $("#perm_list_table .checkboxes:checked").val();
            zzcmConfirm("确定删除当前选中数据？",function(){
                $.post('/perm/delete.json',{id:id},function(data){
                    if(data.result){
                        table._fnAjaxUpdate();
                        //table.fnDraw(true);
                    }else{
                        zzcmAlert(data.msg);
                    }
                });
                //angular.element($('#AppController')).scope().go('userAdd');
            });
        });

        $("#update").click(function(){
            if($("#perm_list_table .checkboxes:checked").length==0){
                zzcmAlert("请选择一条数据");
                return;
            }

            if ($("#perm_list_table .checkboxes:checked").length > 1){
                zzcmAlert("一次只能修改一条数据");
                return;
            }

            var id = $("#perm_list_table .checkboxes:checked").val();

            angular.element($('#AppController')).scope().go('permUpdate',{id:id});
        });
    }
    return {

        //main function to initiate the module
        init: function () {

            if (!jQuery().dataTable) {
                return;
            }
            initTable();
        }

    };

}();