

var Country2 = function () {

    var initTable = function () {

        var table = $('#sample_2');

        $.extend(true, $.fn.DataTable.TableTools.classes, {
            "container": "btn-group tabletools-btn-group pull-right",
            "buttons": {
                "normal": "btn btn-sm default",
                "disabled": "btn btn-sm default disabled"
            }
        });

        table.dataTable({
            "processing":true,
            "serverSide":true,
            "ajax":{
                "url":"/country/test",
                "type":"POST",
                "data": function(country){
                    country.countryname=$("#countryname").val();
                    country.countrycode=$("#countrycode").val();
                }
            },
            "columns": [
                {data:"id",render:function(data,type,full){
                    return "<input type='checkbox' name='checkList' class='checkboxes'  value='"+data+"'>"
                },"sClass": "text-center","bSortable": false},
                {"data": "id", "bSortable": true},
                {"data": "countryname"},
                {"data": "countrycode"}
            ],
            "scrollY": "300",
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "当前没有查询到数据",
                "info": "当前记录数： _START_ 到 _END_ 总计： _TOTAL_ ",
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

            "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.
            "dom": "<'row' <'col-md-12'T>><'row'r>t<'row'<'col-md-2 col-sm-12'l><'col-md-3 col-sm-12'i><'col-md-7 col-sm-12'p>>", // datatable layout without  horizobtal scroll
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
            //导出工具栏控制
            "tableTools": {
                "sSwfPath": "../../assets/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
                "aButtons": [{
                    "sExtends": "xls",
                    "sButtonText": "Excel"
                }]
            },
            "order": [
                [1, "asc"]
            ] // set first column as a default sort by asc
        });

        var tableWrapper = jQuery('#sample_2_wrapper');

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

        var node1 = $('#sample_2_wrapper .row:eq(1)');
        var text = "<div class='row' style='padding-left: 15px;padding-right: 15px'><p>CountryName:<input type='text' name='countryname' id='countryname'>" +
            "&nbsp;&nbsp;&nbsp;CountryCode:<input type='text' name='countrycode' id='countrycode'><button type='submit' class='btn yellow' style='float: right' id='subBtn'>Submit</button></p></div> "

        node1.before(text);

        $("#subBtn").click(function(){
            console.log('country aaa');
            table._fnAjaxUpdate();
        })

        $(".group-checkable").click(function () {
            var check = $(this).prop("checked");
            $(".checkboxes").prop("checked", check);
        });

        function show(data){
            bootbox.dialog({
                message: data,
                title: "Tip",
                buttons: {
                    ok:{
                        label:"OK",
                        className:"green"
                    }

                    //success: {
                    //    label: "Success!",
                    //    className: "green",
                    //    callback: function() {
                    //        //alert("great success");
                    //    }
                    //},
                    //danger: {
                    //    label: "Danger!",
                    //    className: "red",
                    //    callback: function() {
                    //        //alert("uh oh, look out!");
                    //    }
                    //},
                    //main: {
                    //    label: "Click ME!",
                    //    className: "blue",
                    //    callback: function() {
                    //        //alert("Primary button");
                    //    }
                    //}
                }
            });
        }

        $("#delete").click(function(){
            if($(".checkboxes:checked").length==0){
                show("请选择一条数据");
                return;
            }

            if ($(".checkboxes:checked").length > 1){
                show("一次只能修改一条数据");
                return;
            }

            var id = $(".checkboxes:checked").val();
            show(id);
        });
    }
    return {

        //main function to initiate the module
        init: function () {

            if (!jQuery().dataTable) {
                return;
            }

            console.log('country2 1');

            initTable();

            console.log('country2 2');
        }

    };

}();