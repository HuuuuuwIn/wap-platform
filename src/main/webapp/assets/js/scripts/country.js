

var TableAdvanced = function () {

    var initTable = function () {

        var table = $('#sample');

        /* Fixed header extension: http://datatables.net/extensions/scroller/ */

        /* Set tabletools buttons and button container */

        $.extend(true, $.fn.DataTable.TableTools.classes, {
            "container": "btn-group tabletools-btn-group pull-right",
            "buttons": {
                "normal": "btn btn-sm default",
                "disabled": "btn btn-sm default disabled"
            }
        });

        var oTable = table.dataTable({
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

            "dom": "<'row' <'col-md-12'T>><'row'r>t<'row'<'col-md-2 col-sm-12'l><'col-md-3 col-sm-12'i><'col-md-7 col-sm-12'p>>", // datatable layout without  horizobtal scroll
            "scrollY": "300",
            "deferRender": true,
            "columnDefs": [{
                "orderable": false,
                "targets": [0]
            }],
            "order": [
                [0, 'asc']
            ],
            "columns": [
                {"data": "id", "bSortable": true},
                {"data": "countryname"},
                {"data": "countrycode"}
            ],
            "lengthMenu": [
                [5, 10, 20, -1],
                [5, 10, 20, "All"] // change per page values here
            ],
            "pageLength": 10, // set the initial value
            "tableTools": {
                "sSwfPath": "../../assets/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
                "aButtons": [{
                    "sExtends": "xls",
                    "sButtonText": "Excel"
                }]
            }
        });

        var tableColumnToggler = $('#sample_column_toggler');

        var tableWrapper = $('#sample_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown

        /* handle show/hide columns*/
        $('input[type="checkbox"]', tableColumnToggler).change(function () {
            /* Get the DataTables object again - this is not a recreation, just a get of the object */
            var iCol = parseInt($(this).attr("data-column"));
            var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
            oTable.fnSetColumnVis(iCol, (bVis ? false : true));
        });

        // Setup - add a text input to each footer cell
        var node1 = $('#sample_wrapper .row:eq(1)');
        var text = "<div class='row' style='padding-left: 15px;padding-right: 15px'><p>CountryName:<input type='text' name='countryname' id='countryname'>" +
            "&nbsp;&nbsp;&nbsp;CountryCode:<input type='text' name='countrycode' id='countrycode'><button type='submit' class='btn green' style='float: right' id='subBtn'>Submit</button></p></div> "

        node1.before(text);

        $("#subBtn").click(function(){
            console.log('country aaa');
            oTable._fnAjaxUpdate();
        })

    }
    return {

        //main function to initiate the module
        init: function () {

            if (!jQuery().dataTable) {
                return;
            }

            console.log('country 1');

            initTable();

            console.log('country 2');
        }

    };

}();