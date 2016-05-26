var ArctypeAdd = function () {
	var initEvent = function(){
		$("#reidtopbtn").click(function(){
			$('#reid').val(0);
			$('#reidname').text('顶级栏目');
		});
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
    		$('#reid').val(d.node.id);
    		$('#reidname').text(d.node.text);
    		$('#arctypeTree').modal('hide');
    	})
    }
	
    return {
        init: function () {
        	initTree();
            initEvent();
        }
    };
}();