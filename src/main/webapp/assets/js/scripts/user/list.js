var UserList = function () {
    var initTable = function () {
    $("#ckd").html("<input type=\"checkbox\" class=\"group-checkable\" id=\"selectAll_user\" data-set=\"#user_list_table .checkboxes\"/>");
	$("#ckd2").html("<input type=\"checkbox\" class=\"group-checkable\" id=\"table_roles_all\" data-set=\"#table_roles .checkboxes\"/>");

        var table = $('#user_list_table');
        var table_roles = $("#table_roles");
        var myRoles = [];

        table.dataTable({
            "processing":true,
            "serverSide":true,
            "ajax":{
                "url":"/user/list",
                "type":"POST",
                "data": function(user){
                    user.username=$("#username").val();
                }
            },
            "columns": [
                {data:"id",render:function(data,type,full){
                    return "<input type='checkbox' name='checkList' class='checkboxes' data-set='#user_list_table .checkboxes'  value='"+data+"'>"
                },"sClass": "text-center","bSortable": false},
                {"data": "id", "bSortable": true},
                {"data": "username"},
                {"data": "state"},
                {"data": "createTime"}
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

        var tableWrapper = jQuery('#user_list_table_wrapper');

        table.find('.group-checkable').change(function () {
            var set = jQuery(this).attr("data-set");
            var checked = jQuery(this).is(":checked");
            jQuery(set).each(function () {
                if (checked) {
                    $(this).attr("checked", true);
                } else {
                    $(this).attr("checked", false);
                }
            });
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

       // var node1 = $('#user_list_table_wrapper .row:eq(0)');
        //var text = "<div class='row' style='padding-left: 15px;padding-right: 15px'><p>用户名称<input type='text' name='username' id='username'>" +
       //     "<button type='submit' class='btn green' style='float: right' id='subBtn'>搜索</button></p></div> "

       // node1.before(text);

        $("#subBtn").click(function(){
            table._fnAjaxUpdate();
        })

        $("#selectAll_user").click(function () {
            var check = $(this).prop("checked");
            $("#user_list_table .checkboxes").prop("checked", check);
        });


        $("#delete").click(function(){
            //angular.element($('#AppController')).scope().go('userUpdate',{id:"sssssss"});
            if($("#user_list_table .checkboxes:checked").length==0){
                zzcmAlert("请选择一条数据");
                return;
            }

            if ($("#user_list_table .checkboxes:checked").length > 1){
                zzcmAlert("一次只能修改一条数据");
                return;
            }

            var id = $("#user_list_table .checkboxes:checked").val();
            zzcmConfirm("确定删除当前选中数据？",function(){
                $.post('/user/delete.json',{id:id},function(data){
                    if(data){
                        //table._fnAjaxUpdate();
                        table.fnDraw(true);
                    }else{
                        show("内部错误");
                    }
                });
                //angular.element($('#AppController')).scope().go('userAdd');
            });
        });
        var flag = false;
        $("#setRoles").click(function(){
            if($("#user_list_table .checkboxes:checked").length==0){
                zzcmAlert("请选择至少一条数据");
                return;
            }
            if ($("#user_list_table .checkboxes:checked").length > 1){
                zzcmAlert("一次只能修改一条数据");
                return;
            }

            var id = $("#user_list_table .checkboxes:checked").val();
            var roles = $("#table_roles input[type=checkbox]");
            roles.prop("checked", false);
            $.post("/user/getRoles.json",{id:id},function(data){
                myRoles = data;
                for(var i=0;i<data.length;i++){
                    var rid = data[i].id;
                    roles.each(function(){
                        if(rid==$(this).val()){
                            $(this).prop("checked", true);
                        }
                    });
                }
                $("#selectRolesModal").modal('show');
                if(!flag){
                    $("#selectRolesModal").on('shown.bs.modal', function () {
                        if(flag) return;
                        var tabs = $("#table_roles").css("width");
                        $("#table_roles_wrapper .dataTables_scrollHeadInner").css("width",tabs);
                        $("#table_roles_wrapper .dataTables_scrollHeadInner").find("table").css("width","100%");
                        var ths = $("#table_roles_wrapper .dataTables_scrollHeadInner").find("table tr th");
                        $.each(ths,function(i,n){
                            var ww = $("#table_roles_wrapper .dataTables_scrollBody").find("tbody tr td:eq("+i+")");
                            var wi = ww.outerWidth();
                            if(i!=0){
                                wi = wi-26;
                            }
                            $(this).css("width",wi+"px");
                        });
                        flag = true;
                    });
                }
            });
        });


        table_roles.dataTable({
            "processing":true,
            "serverSide":true,
            "ajax":{
                "url":"/role/list",
                "type":"POST"
            },
            "columns": [
                {data:"id",render:function(data,type,full){
                    return "<input type='checkbox' name='selectRoles' class='checkboxes' data-set='#table_roles .checkboxes' value='"+data+"'>"
                },"sClass": "text-center","bSortable": false},
                {"data": "id"},
                {"data": "roleName"},
                {"data": "roleSign"},
                {"data": "description"}
            ],
            "scrollY": "300",
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
            "createdRow": function ( row, data, index ) {
                for(var i=0;i<myRoles.length;i++){
                    var rid = myRoles[i].id;
                    if(rid==data.id){
                        $("input", row).prop("checked", true);
                    }
                }
                return row;
            },
            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

            //"bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.
            "dom": "<'row' r>t<'row'<'col-md-3 col-sm-12'l><'col-md-2 col-sm-12'i><'col-md-7 col-sm-12'p>>", // datatable layout without  horizobtal scroll
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

        $("#table_roles_all").click(function () {
            var check = $(this).prop("checked");
            $("#table_roles .checkboxes").prop("checked", check);
        });

        $("#save").click(function(){
            var roles = $("#table_roles input[type=checkbox]:checked");
            var users = $("#user_list_table input[type=checkbox]:checked").val();

            var role = "";
            roles.each(function () {
                role += $(this).val()+","
            });

            $.post("/user/setRoles.json",{userId:users,roles:role},function(data){
                if(data){
                    $("#selectRolesModal").modal('toggle')
                }else{
                    show("内部错误。");
                }
            })
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