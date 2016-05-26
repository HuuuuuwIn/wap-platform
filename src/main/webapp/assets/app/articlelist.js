MetronicApp.controller('articleCtrl', ['$stateParams','$rootScope', '$scope','$http','$state', 'settings','$timeout','locals', function($stateParams,$rootScope, $scope,$http,$state, settings,$timeout,locals) {
    $("#ckd").html(
    		"<input type='checkbox' id='audit' data-type='all'/>审核&nbsp;" +
    		"<input type='checkbox' id='suggest' data-type='all'/>推荐&nbsp;" +
			"<input type='checkbox' id='del' data-type='all''/>删除&nbsp;&nbsp;" +
    		"<input type='checkbox' id='istop' data-type='all'/>置顶");
    		
    $scope.pageStart = 0;
	$scope.pageSize = 20;
    $scope.formData={};
	$scope.selected=new Object();
	/*$scope.columnStatus = new Array();*/
    $scope.selected.del=new Array();
    $scope.selected.ismake=new Map();
    $scope.selected.flag=new Map();
    $scope.selected.istop=new Map();
    
    $scope.getChildNodes=function(pid,sub){
    	$.ajax({
		  method: "get",
		  async : false,
		  url: "/article/childNodes/" + pid
		}).done(function(data) {
			$(sub).removeAttr("disabled");
			sub.options.length = 0;
			sub.options.add(new Option("全部",""));
			$.each(data,function(i,v){
				sub.options.add(new Option(v.typename,v.id));
			});
		});
	}
	
	$scope.initForm=function(){
    	var ts=document.getElementById("ownweb");
		var sub=document.getElementById('ownwebSecond');
		ts.options.add(new Option("全部",""));
		sub.options.add(new Option("全部",""));
		$.ajax({
		  method: "POST",
		  async : false,
		  url: "/article/childNodes/" + 0
		}).done(function(data) {
			$.each(data,function(i,v){
				ts.options.add(new Option(v.typename,v.id));
			})
		});
		$(ts).change(function(o){
			if($(this).val() == ""){
				$('#ownwebSecond option[value=""]').attr("selected",true);
				$(sub).attr("disabled","disabled");
			}else{
				$scope.getChildNodes($(this).val(),sub);
			}
		});
    }
    
    $scope.initCheckBox=function(){
		$("#audit").click(function(){
			$scope.selectAll(this);
			var ckd = $(this).is(':checked');
			if (ckd) {
				$("#del").attr('disabled','disabled');
			} else {
				$("#suggest").get(0).checked = false;
				$("#istop").get(0).checked = false;
				$("#del").removeAttr('disabled');
			}
			$timeout(jQuery.uniform.update,0);
		});
		
		$("#suggest").click(function(){
			$scope.selectAll(this);
			var ckd = $(this).is(':checked');
			var ac = $("#audit").is(':checked');
			if(ckd){
				$("#del").attr('disabled','disabled');
				if(!ac){
					$("#audit").get(0).checked = true;
				}
			}else{
				$("#istop").get(0).checked = false;
				if(!ac){
					$("#del").removeAttr('disabled');
				}
			}
			$timeout(jQuery.uniform.update,0);
		});
		
		$("#del").click(function(){
			$scope.selectAll(this);
			var ckd = $(this).is(':checked');
			if(ckd){
				$("#suggest").attr('disabled','disabled');
				$("#audit").attr('disabled','disabled');
				$("#istop").attr('disabled','disabled');
			}else{
				$("#suggest").removeAttr('disabled');
				$("#audit").removeAttr('disabled');
				$("#istop").removeAttr('disabled');
			}
			$timeout(jQuery.uniform.update,0);
		});
		
		$("#istop").click(function(){
			$scope.selectAll(this);
			var ckd = $(this).is(':checked');
			if(ckd){
				$("#audit").attr('checked','checked');
				$("#suggest").attr('checked','checked');
				$("#del").attr('disabled','disabled');
			}
			$timeout(jQuery.uniform.update,0);
		});
    }
    //全选
    $scope.selectAll=function(obj){
    	var ckd = obj.checked;
		if($(obj).attr('id') == 'del'){
			$('input[name=del]').each(function(i,v){
				if(this.disabled != true){
					this.checked = ckd;
					$scope.delBinding(this);
				}
			});
		}else if($(obj).attr('id') == 'audit'){
			$('input[name=audit]').each(function(i,v){
				if(this.disabled != true){
					this.checked = ckd;
					$scope.auditBinding(this);
				}
			});
		}else if($(obj).attr('id') == 'suggest'){
			$('input[name=suggest]').each(function(i,v){
				if(this.disabled != true){
					this.checked = ckd;
					$scope.suggestBinding(this);
				}
			});
		}else if($(obj).attr('id') == 'istop'){
			$('input[name=istop]').each(function(i,v){
				if(this.disabled != true){
					this.checked = ckd;
					$scope.istopBinding(this);
				}
			});
		}
    }
    
    $scope.delBinding=function(element){
		var checked = $(element).is(':checked');
		if(checked){
			$(element).siblings().attr('disabled','disabled');
			$scope.selected.del.push($(element).val());
		}else{
			$(element).siblings().removeAttr('disabled');
			$scope.selected.del.remove($(element).val());
		}
	}
	
    $scope.auditBinding=function(element){
		var checked = $(element).is(':checked');
		if(checked){
			$(element).siblings('input[name=del]').attr('disabled','disabled');
			$scope.selected.ismake.put($(element).val(),{
				'ismake' : $(element).data("ismake")
			});
		}else{
			var ckFlag = $(element).siblings('input[name=suggest]');
			var ckIstop = $(element).siblings('input[name=istop]');
			$(element).siblings('input[name=del]').removeAttr('disabled');
			if(ckFlag.attr("checked")){
				$scope.selected.flag.remove($(element).val());
			}
			ckFlag.attr("checked",false);
			if(ckIstop.attr("checked")){
				$scope.selected.istop.remove($(element).val());
			}
			ckIstop.attr("checked",false);
			$scope.selected.ismake.remove($(element).val());
		}
	}
		
	$scope.suggestBinding=function(element){
		var checked = $(element).is(':checked');
		var ckAudit = $(element).siblings('input[name=audit]');
		var ckIstop = $(element).siblings('input[name=istop]')
		if(checked){
			$(element).siblings('input[name=del]').attr('disabled','disabled');
			if(!ckAudit.is(':checked')){
				ckAudit.attr("checked",true);
				$scope.selected.ismake.put($(element).val(),{
					'ismake' : $(element).data("ismake")
				});
			}
			$scope.selected.flag.put($(element).val(),{
				'flag' : $(element).data("flag")
			});
		}else{
			if(ckIstop){
				ckIstop.attr("checked",false);
				$scope.selected.istop.remove($(element).val());
			}
			$scope.selected.flag.remove($(element).val());
		}
	}
	
	$scope.istopBinding=function(element){
		var checked = $(element).is(':checked');
		if(checked){
			var ckAudit = $(element).siblings('input[name=audit]');
			var ckFlag = $(element).siblings('input[name=suggest]');
			if(!ckAudit.is(':checked')){
				ckAudit.attr('checked','checked');
				$scope.selected.ismake.put($(element).val(),{
					'ismake' : $(element).data("ismake")
				});
			}
			if(!ckFlag.is(':checked')){
				ckFlag.attr('checked','checked');
				$scope.selected.flag.put($(element).val(),{
					'flag' : $(element).data("flag")
				});
			}
			$(element).siblings('input[name=del]').attr('disabled','disabled');
			$scope.selected.istop.put($(element).val(),{
				'istop' : $(element).data("sortrank")
			});
		}else{
			$scope.selected.istop.remove($(element).val())
		}
	}
	
    /*$scope.binding=function(){
		$('input[name=del]').click(function(){
			$scope.delBinding(this);
		});
		
		$('input[name=audit]').click(function(){
			$scope.auditBinding(this);
		});
		
		$('input[name=suggest]').click(function(){
			$scope.suggestBinding(this);
		});
	}*/
	$scope.articleFrom=function(keep){
		if(!keep && keep!=false){
			keep = true;
		}
		$scope.clearAllSelected();
		$("#sampleArticle").dataTable().fnDraw(keep)
	}
	
	$scope.search=function(keep){
		$scope.articleFrom(keep);
		$scope.changeStatus();
	}
	
	/*$scope.joinId=function(rows){
    	var ids = '';
    	for (var i = 0; i < rows.length; i++) {
			if(ids == ''){
				ids += rows[i].value;
			}else{
				ids += ',' + rows[i].value;
			}
		}
    	return ids;
    }*/
    $scope.batchEdit=function(){
    	if($scope.selected.ismake.size() == 0 && $scope.selected.istop.size() == 0 && $scope.selected.flag.size() == 0 && $scope.selected.del.length == 0){
    		zzcmAlert("请选择需要操作的内容","提示");
    		return;
    	}
    	var param = new Object();
		var arrayTemp = new Array();
    	if($scope.selected.ismake.size() != 0){
    		$.each($scope.selected.ismake.keySet(),function(i,v){
    			if($scope.selected.ismake.get(v).ismake == 1) return;
    			arrayTemp.push(v);
    		});
    		param.auditId = arrayTemp.join();
    	}
    	if($scope.selected.flag.size() != 0){
    		arrayTemp.clear();
    		$.each($scope.selected.flag.keySet(),function(i,v){
    			if($scope.selected.flag.get(v).flag == 1) return;
    			arrayTemp.push(v);
    		});
    		param.suggestId = arrayTemp.join();
    	}
    	if($scope.selected.del.length != 0){
    		param.delId = $scope.selected.del.join();
    	}
    	if($scope.selected.istop.size() != 0){
    		arrayTemp.clear();
    		$.each($scope.selected.istop.keySet(),function(i,v){
    			if($scope.selected.istop.get(v).istop == 5) return;
    			arrayTemp.push(v);
    		});
    		param.istopId = arrayTemp.join();
    	}
    	$.ajax({
		  	method: "POST",
		  	url: "/article/batchEdit",
		  	data : param
		}).done(function(data) {
			$scope.articleFrom();
			$scope.changeStatus();
		});
    }
    
    $scope.cancelRecommend=function(){
    	if($scope.selected.flag.size() == 0){
    		zzcmAlert("请选择需要操作的内容","提示");
    		return;
    	}
    	if($scope.selected.flag.size() == 1){
    		if($scope.selected.flag.get($scope.selected.flag.keySet()[0]).flag != 1){
    			zzcmAlert("选中的新闻还未被推荐，无法取消!","提示",1000);
    		}else{
    			$.ajax({
				  	method: "POST",
				  	url: "/article/cancelRecommend",
				  	data : {suggestId:$scope.selected.flag.keySet()[0]}
				}).done(function(data) {
					$scope.articleFrom();
					$scope.changeStatus();
				});
    		}
    	}else if($scope.selected.flag.size() > 1){
    		var arrayTemp = new Array();
    		$.each($scope.selected.flag.keySet(),function(i,v){
    			if($scope.selected.flag.get(v).flag != 1) return;
    			arrayTemp.push(v);
    		});
	    	if(arrayTemp.length==0){
	    		zzcmAlert("选中的新闻还未被推荐，无法取消!","提示",1000);
	    		return;
	    	}
    		zzcmConfirm('您确定要取消推荐吗?',function(){
				$.ajax({
				  	method: "POST",
				  	url: "/article/cancelRecommend",
				  	data : {suggestId : arrayTemp.join()}
				}).done(function(data) {
					$scope.articleFrom();
					jQuery.uniform.update($('#suggest').attr('checked',false));
					jQuery.uniform.update($('#audit').attr('checked',false));
					jQuery.uniform.update($('#istop').attr('checked',false));
					jQuery.uniform.update($('#del').removeAttr("disabled"));
				});
			},'取消推荐','取消','确定');
		}
    }
    
    $scope.cancelTop=function(){
    	if($scope.selected.istop.size() == 0){
    		zzcmAlert("请选择需要操作的内容","提示");
    		return;
    	}
    	if($scope.selected.istop.size() == 1){
    		if($scope.selected.istop.get($scope.selected.istop.keySet()[0]).istop != 5){
    			zzcmAlert("选中的新闻还未被置顶，无法取消!","提示",1000);
    		}else{
    			$.ajax({
				  	method: "POST",
				  	url: "/article/cancelTop",
				  	data : {topId:$scope.selected.istop.keySet()[0]}
				}).done(function(data) {
					$scope.articleFrom();
					$scope.changeStatus();
				});
    		}
    	}else if($scope.selected.istop.size() > 1){
    		var arrayTemp = new Array();
    		$.each($scope.selected.istop.keySet(),function(i,v){
    			if($scope.selected.istop.get(v).istop != 5) return;
    			arrayTemp.push(v);
    		});
	    	if(arrayTemp.length==0){
	    		zzcmAlert("选中的新闻还未被置顶，无法取消!","提示",1000);
    			return;
    		}
    		zzcmConfirm('您确定要取消置顶吗?',function(){
				$.ajax({
				  	method: "POST",
				  	url: "/article/cancelTop",
				  	data : {topId : arrayTemp.join()}
				}).done(function(data) {
					$scope.articleFrom();
					jQuery.uniform.update($('#suggest').attr('checked',false));
					jQuery.uniform.update($('#audit').attr('checked',false));
					jQuery.uniform.update($('#istop').attr('checked',false));
					jQuery.uniform.update($('#del').removeAttr("disabled"));
				});
			},'取消置顶','取消','确定');
		}
    }
    
    $scope.changeStatus=function(){
    	jQuery.uniform.update($('#suggest').attr('checked',false));
		jQuery.uniform.update($('#audit').attr('checked',false));
		jQuery.uniform.update($('#del').attr('checked',false));
		jQuery.uniform.update($('#istop').attr('checked',false));
		jQuery.uniform.update($('#suggest').removeAttr("disabled"));
		jQuery.uniform.update($('#audit').removeAttr("disabled"));
		jQuery.uniform.update($('#del').removeAttr("disabled"));
		jQuery.uniform.update($('#istop').removeAttr("disabled"));
    }
    
   /* $scope.scanImgSetWH = function(){
     	var arr = new Array();
     	var num = 0;
	     $("div[name=picture] img").each(function(){
    		arr[num] = $(this);
	     	num++;
		 });
		 arr = $scope.actionImgSetByArray(arr);//第一次处理
		 setTimeout(function(){
		     arr = $scope.actionImgSetByArray(arr);//第二次处理
		 },250);
	}

 	$scope.actionImgSetByArray = function(arr){
	 	var tmpArr = new Array();
    	var num = 0;
	    for(var i=0;i<arr.length;i++){
	        var tmp = $(arr[i]);
	        if(tmp.height() == 126 && tmp.width() == 70) continue;
	        	if(tmp.width()/tmp.height() >= 1.8){
	        		tmp.width("").height("70px");
	            }else{
	            	tmp.height("").width("126px");
	            }
	        if(tmp.width() <= 0 || tmp.height() <=0 ){
	            tmpArr[num] = tmp;
	            num++;
	        }else{
	        	if(tmp.height() < 70){
	            	tmp.height("70px");
	            }
	            if(tmp.width() < 126){
	            	tmp.width("126px");
	            }
	            tmp.fadeIn("slow");
	        }
	    }
    	return tmpArr;
	}
*/	
    $scope.toggleArticleInput=function(id){
    	$scope.addFormData();
   		angular.element($('#AppController')).scope().go('articleinput',{"id" : id});
    }
    
    $scope.actionImgSetByArray2=function(arr,data){
	    var tmp = $(arr);
	    if(!data.litpictype || data.litpictype == ''){
	    	if(tmp.height() == 126 && tmp.width() == 90)return;
			if(tmp.width()/tmp.height() >= 1.4){
		 		tmp.width("").height("90px");
			}else{
		    	tmp.height("").width("126px");
		   	}
			if(tmp.height() < 90){
		 		tmp.height("90px");
		   	}
		   	if(tmp.width() < 126){
		    	tmp.width("126px");
		   	}
	    }else{
	    	tmp.width("126px");
	    }
	   	tmp.fadeIn("slow");
	}
	
	$scope.restoreFormData=function(){
		var cacheFiltertitle = locals.get("article_cache_filtertitle");
		var cacheIsmake = locals.get("article_cache_ismake");
		var cacheThumbnail = locals.get("article_cache_thumbnail");
		var cacheIstop = locals.get('article_cache_istop')
		var cacheOwnweb = locals.get("article_cache_ownweb");
		var cacheOwnwebsecond = locals.get("article_cache_ownwebsecond");
		var cachePagestart = locals.get("article_cache_pageindex");
		var cachePagesize = locals.get("article_cache_pagesize");
		if(cacheFiltertitle) $scope.formData.filterTitle = cacheFiltertitle;
		if(cachePagestart) $scope.pageStart = cachePagestart;
		if(cachePagesize) $scope.pageSize = cachePagesize;
		if(!cacheIsmake){
			$scope.formData.ismake = 0;
		}else if(cacheIsmake == 'ismake_all'){
			$scope.formData.ismake = '';
		}else{
			$scope.formData.ismake = cacheIsmake;
		}
		if(cacheThumbnail) $scope.formData.thumbnail = cacheThumbnail;
		if(cacheIstop) $scope.formData.sortrank = cacheIstop;
		$scope.formData.ownweb='';
		if(cacheOwnweb){
			$('#ownweb option[value='+cacheOwnweb+']').attr("selected",true);
			$scope.formData.ownweb=cacheOwnweb;
		}
		if($scope.formData.ownweb==''){
			$('#ownwebSecond').attr("disabled","disabled");
		}else{
			$scope.getChildNodes($scope.formData.ownweb,$('#ownwebSecond').get(0));
		}
		if(cacheOwnwebsecond) {
			$('#ownwebSecond option[value="'+cacheOwnwebsecond+'"]').attr("selected",true);
		}
		var cacheAuditckd = locals.get("article_cache_audit_ckd");
		var cacheFlagckd = locals.get("article_cache_flag_ckd");
		var cacheDelckd = locals.get("article_cache_del_ckd");
		var cacheIstopckd = locals.get('article_cache_istop_ckd')
		locals.set("article_cache_audit_ckd",$scope.selected.ismake.keySet().join());
		locals.set("article_cache_flag_ckd",$scope.selected.flag.keySet().join());
		locals.set("article_cache_istop_ckd",$scope.selected.istop.keySet().join());
		if(cacheDelckd) $scope.selected.del = cacheDelckd.split(",");
		if(cacheAuditckd){
			var key;
			var cacheObj = JSON.parse(cacheAuditckd);
			for(var k in cacheObj){
				key = k;
				break;
			}
			$scope.selected.ismake.setMap(cacheObj[key]);
		}
		if(cacheFlagckd){
			var key;
			var cacheObj = JSON.parse(cacheFlagckd);
			for(var k in cacheObj){
				key = k;
				break;
			}
			$scope.selected.flag.setMap(cacheObj[key]);
		}
		if(cacheIstopckd){
			var key;
			var cacheObj = JSON.parse(cacheIstopckd);
			for(var k in cacheObj){
				key = k;
				break;
			}
			$scope.selected.istop.setMap(cacheObj[key]);
		}
		/*var cacheColumnstatus = locals.get("article_cache_columnstatus");
		if(cacheColumnstatus){
			$scope.columnStatus = cacheColumnstatus.split(',');
		}*/
	}
	
	$scope.addFormData=function(){
		var cacheFiltertitle=$scope.formData.filterTitle;
    	var cacheIsmake=$scope.formData.ismake;
    	var cacheThumbnail=$scope.formData.thumbnail;
    	var cacheIstop=$scope.formData.sortrank;
    	var cacheOwnweb=$('#ownweb').val();
    	var cacheOwnwebsecond=$('#ownwebSecond').val();
    	//var cacheOwnweb=$scope.formData.ownweb;
    	//var cacheOwnwebsecond=$scope.formData.ownwebSecond;
		if(cacheFiltertitle && cacheFiltertitle!='') locals.set("article_cache_filtertitle",cacheFiltertitle);
		if(cacheIsmake === '') {
			locals.set("article_cache_ismake",'ismake_all');
		}else{
			locals.set("article_cache_ismake",cacheIsmake);
		}
		if(cacheThumbnail) locals.set("article_cache_thumbnail",cacheThumbnail);
		if(cacheIstop) locals.set("article_cache_istop",cacheIstop);
		if(cacheOwnweb) locals.set("article_cache_ownweb",cacheOwnweb);
		if(cacheOwnwebsecond) locals.set("article_cache_ownwebsecond",cacheOwnwebsecond);
		locals.set("article_cache_pageindex",$scope.pageStart);
		locals.set("article_cache_pagesize",$scope.pageSize);
		
		locals.set("article_cache_audit_ckd",JSON.stringify($scope.selected.ismake));
		locals.set("article_cache_flag_ckd",JSON.stringify($scope.selected.flag));
		locals.set("article_cache_del_ckd",$scope.selected.del.join());
		locals.set("article_cache_istop_ckd",JSON.stringify($scope.selected.istop));
		/*locals.set("article_cache_columnstatus",$scope.columnStatus.join());*/
	}
	
	$scope.clearAllSelected=function(){
    	$scope.selected.del.clear();
    	$scope.selected.ismake.clear();
    	$scope.selected.flag.clear();
    	$scope.selected.istop.clear();
    }
    
	/*
     * cut image begin
     */
    $scope.cropPicture = new Picture();
    $scope.cropNum = 0;
    $scope.cropRadio = 1;
//    $scope.imgElement = $('#cutimg');
    $scope.cropJcp = null;
    $scope.bigLitpic = new Array();
    
    $scope.resetCrop=function(){
    	$scope.cropPicture = new Picture();
    	$scope.allLitpic = new Array();
    	$scope.bigLitpic = new Array();
	    $scope.cropNum = 0;
	    $scope.cropRadio = 1;
	    $scope.cropJcp = null;
	    $scope.cropColumn = 0;
    }
    
    $scope.setImgElement=function(src){
		$scope.imgElement.attr('src',src)
    }
    
    $scope.initJcrop=function(width,height){
    	if($scope.cropJcp){
    		$scope.cropJcp.destroy();
    		var src = $('#cutimg').attr('src');
    		$('#cutimg').remove();
    		var cutimg = $('<img/>').appendTo($('#left'));
    		cutimg.attr('id','cutimg').attr('src',src);
		}
		$('#cutimg').Jcrop({
    		aspectRatio : 1.4,
    		onSelect : $scope.updateCoords,
    		boxWidth : width,
    		boxHeight : height,
    		setSelect: [126,90,0,0]
    	},function(){
    		$scope.cropJcp = this;
    	});
    	$scope.radioDisabled(width,height);
    }
    
    $scope.setJcrop=function(radioType){
		var width = $scope.cropPicture.getWidth();
		var heiht = $scope.cropPicture.getHeight();
		var scale = width / heiht;
		if(scale >= 1){
			if(width > 496){
				width = 496;
			}
		}else{
			if(heiht > 496){
				heiht = 496;
			}
		}
		$scope.initJcrop(width,heiht);
		if(radioType == 2 || radioType == 4){
			$scope.cropJcp.setOptions({aspectRatio : 2.1565});
			$scope.cropJcp.setSelect([496,230,0,0]);
		}else{
			$scope.cropJcp.setOptions({aspectRatio : 1.4});
			$scope.cropJcp.setSelect([126,90,0,0]);
		}
    }
    
    //设置图片左右
    $scope.setImagesides=function(img,data){
		for (var i = 0; i < data.length; i++) {
			if(data[i].path == img.getSrcPath()){
				if(data[i-1]){
					img.setLeft(data[i-1].path);
				}else{
					img.setLeft('');
				}
				if(data[i+1]){
					img.setRight(data[i+1].path);
				}else{
					img.setRight('');
				}
				break;
			}
		}
		if(!$scope.cropPicture.getLeft() || $scope.cropPicture.getLeft() == ''){
    		$('.bar-left').css('visibility','hidden');
			$('.emcss[name=left]').css('visibility','hidden');
		}else{
			$('.bar-left').css('visibility','visible');
			$('.emcss[name=left]').css('visibility','visible');
		}
		if(!$scope.cropPicture.getRight() || $scope.cropPicture.getRight() == ''){
			$('.bar-right').css('visibility','hidden');
			$('.emcss[name=right]').css('visibility','hidden');
		}else{
			$('.bar-right').css('visibility','visible');
			$('.emcss[name=right]').css('visibility','visible');
		}
		return img;
	}
	
    $scope.setPicture=function(src,oper){
    	var img = $('#cutimg');
    	img.attr('src',src);
    	var cachedata = JSON.parse(locals.getSession('article_item_data'));
    	var cachedataImg = JSON.parse(locals.getSession('article_item_dataImg'));
    	var dataImg = $scope.allLitpic;
    	$.each(cachedataImg,function(i,v){
    		if(v.path == src){
    			$scope.cropPicture.setWidth(v.width);
    			$scope.cropPicture.setHeight(v.height);
    			return;
    		}
    	});
    	$scope.cropPicture.setSrcPath(src);
    	$scope.cropPicture.setDependence(cachedata.id);
    	//禁用当前窗口不符合尺寸的radio
//    	$scope.radioDisabled(width,height);
    	//点击切换图标
    	if(oper == 'toggle' && ($scope.cropRadio == 2 || $scope.cropRadio == 4)){//大图
			dataImg = $scope.bigLitpic;
    	}
		$scope.cropPicture = $scope.setImagesides($scope.cropPicture,dataImg);
    }
    
    //show裁减窗口
    $scope.showImageCut=function(elemt,data,column){
    	$scope.resetCrop();
    	$scope.cropColumn = column;
    	locals.setSession('article_item_data',JSON.stringify(data));
    	$.ajax({
		  	method: "get",
		  	url: "article/getArticleImg/" + data.id,
		  	async : false
		}).done(function(dataImg) {
			locals.setSession('article_item_dataImg',JSON.stringify(dataImg));
			$scope.cropNum = dataImg.length;
			$scope.allLitpic = dataImg;
//    		var src = $(elemt).attr('src');
			var src = dataImg[column-1].path;
			for (var i = 0; i < dataImg.length; i++) {
	    		if(dataImg[i].width >= 496 && dataImg[i].height >= 230){
	    			$scope.bigLitpic.push(dataImg[i]);
	    		}
	    		if(i < 3){
	    			$scope.cropPicture.addLitpicbak(dataImg[i].path);
	    		}
	    	}
	    	$scope.setPicture(src,'show');
	    	var litpictype = data.litpictype;
	    	switch(litpictype){
	    		case 1:
	    			if($scope.cropNum < 3){
	    				$scope.cropRadio = 5;//小图
	    			}else{
	    				$scope.cropRadio = 3;//一张小图
	    			}
	    			break;
	    		case 2:
	    			if($scope.cropNum < 3){
	    				$scope.cropRadio = 4;
	    			}else{
	    				$scope.cropRadio = 2;
	    			}
	    			break;
	    		case 3:
	    			$scope.cropRadio = 1;
	    			break;
	    	}
	    	var width = $scope.cropPicture.getWidth();
			var heiht = $scope.cropPicture.getHeight();
			var scale = width / heiht;
			if(scale >= 1){
				if(width > 496){
					width = 496;
				}
			}else{
				if(heiht > 496){
					heiht = 496;
				}
			}
	    	$scope.initJcrop(width,heiht);
//			var elemtNmae = $(elemt).attr('name');
//			$('.hover').removeClass('hover');
//			$('a[name='+elemtNmae+']').addClass('hover');
	    	$('#imageCutView').modal('show');
		});
    	$('#imageCutView').one('hide.bs.modal',function(){
    		if($scope.cropJcp){
    			$scope.cropJcp.destroy();
    		}
    		$('#preview').removeAttr('src');
    	});
    	$timeout(jQuery.uniform.update,0);
    }
    
    $scope.radioDisabled=function(width,height){
    	if(width < 496 || height < 230){
    		$('input[name=radio1]').eq(1).attr("disabled",true);
    		$('input[name=radio1]').eq(3).attr("disabled",true);
    	}else{
    		$('input[name=radio1]').eq(1).attr("disabled",false);
    		$('input[name=radio1]').eq(3).attr("disabled",false);
    	}
    }
    
    /*$scope.setScroll=function(x,y){
    	$scope.scrollX = x;
    	$scope.scrollY = y;
    }*/
    
    $scope.updateCoords=function(c){
    	if($scope.cropPicture){
    		$scope.cropPicture.setCrop(c);
    	}
    }
    
//    $scope.toggleImg=function(name){
//    	var emt = $('a[name='+name+']');
//    	var i = emt.data('type');
//    	var data = JSON.parse(locals.getSession('article_item_data'));
//    	var cachedataImg = JSON.parse(locals.getSession('article_item_dataImg'));
//    	var src = cachedataImg[i-1].path;
//    	var src = data.litpic.split(',')[i-1];
//    	$scope.setPicture(src,'toggle');
//    	$('.hover').removeClass('hover');
//    	emt.addClass('hover');
//    	$scope.setJcrop($scope.cropRadio);
//    }
    
    $scope.cutImage=function(actionType){
    	if(!actionType) return;
	    if ($scope.cropPicture.accordSize()) {
	    	$scope.cropPicture.setOther(actionType);
	    	$scope.cropPicture.setScale($scope.cropJcp.getScaleFactor()[0]);
	    	if($scope.cropRadio == 2 || $scope.cropRadio == 4) {//大图
	    		$scope.cropPicture.setLitpicType(2);
	    	}else if($scope.cropRadio == 1){//3张小图
	    		$scope.cropPicture.setLitpicType(3);
	    		var data = JSON.parse(locals.getSession('article_item_data'));
	    		$scope.cropPicture.setLitpic(data.litpic);
	    		$scope.cropPicture.setLitpicIndex($scope.cropColumn-1);
	    	}else{
	    		$scope.cropPicture.setLitpicType(1);
	    	}
	    	$.ajax({
				method : "get",
				data : $scope.cropPicture.getData(),
				url : "/upfile/cut"
			}).done(function(data) {
				if(actionType == 1) {
					var localPath = data.filePath + '/' + data.fileName;
					$scope.cropPicture.setLocalPath(localPath);
					$('#preview').attr('src',localPath).height("90px").width("126px");
					$('.andArea').css('padding-top','0px');
					$('#preview').fadeIn("slow");
				}
				if(actionType == 2) {
					$scope.search(true);
					$('#imageCutView').modal('hide');
				}
			});
	    	return true;
	    }
	    zzcmAlert("'请选择一个裁剪区域然后按提交'","提示");
	    return false;
    }
    //cut image end
    $scope.initTable=function () {
        var table = $('#sampleArticle');
        var oTable = table.dataTable({
        	"fnDrawCallback":function(s){
        		var scroll = 0;
        		var changePage = locals.getSession('change_page');
        		if(changePage && changePage == 1) {
        			locals.setSession('article_dataTables_scroll',0);
        			sessionStorage.removeItem("change_page");
        		}else{
        			scroll = locals.getSession('article_dataTables_scroll');
        			if(!scroll) scroll = 0;
        		}
        		$('.dataTables_scrollBody').scrollTop(scroll);
        	},
        	"fnInitComplete":function(s){
	    		$($('table.table-striped').get(0)).css('width','');
	    		$('div.dataTables_scrollHeadInner').css('width','');
        	},
            "processing":true,
            "serverSide":true,
            "displayStart" : $scope.pageStart,
            "ajax":{
                "url":"/article/list",
                "type":"POST",
                "data": function(param){
                	$scope.pageStart = param.start;
                	$scope.pageSize = param.length;
                	param.filterTitle=$scope.formData.filterTitle;
                	param.ismake=$scope.formData.ismake;
                	param.thumbnail=$scope.formData.thumbnail;
                	param.istop=$scope.formData.sortrank;
                	param.ownweb=$('#ownweb').val();
                	param.ownwebSecond=$('#ownwebSecond').val();
				}
				//error:function(XMLHttpRequest, textStatus, errorThrown){
				//	if(XMLHttpRequest.status==401){
				//		window.location.href="/login";
				//	}
				//}
            },
			//"bStateSave": true,
            "dom": "<'row'r>t<'row'<'col-md-2 col-sm-12'l><'col-md-4 col-sm-12'i><'col-md-6 col-sm-12'p>>", // datatable layout without  horizobtal scroll
            "scrollY": window.innerHeight - 218,
            //"deferRender": true,
            "columnDefs": [{
                "orderable": false,
                "targets": [0]
            }],
            "order": [
                //[2, 'desc']
            ],
            "columns": [
                {"data": function(data){
                	return "<a name='toggle'>" +data.title+ "</a>";
                },"bSortable": false,"width":200},
                {"data": function(data){
                	if(!data.litpic) return '';
                	var litpic = data.litpic.split(",");
                	return "<div style='overflow: hidden;height:90px;width:126px;background: #ffffff;' name='picture'><img name='s1' src='"+litpic[0]+"'/></div>";
                },"width":130,"bSortable": false},
                {"data": function(data){
                	if(!data.litpic) return '';
                	var litpic = data.litpic.split(",");
                	if(litpic.length < 2) return '';
                	return "<div style='overflow: hidden;height:90px;width:126px;background: #ffffff;' name='picture'><img name='s2' src='"+litpic[1]+"'/></div>";
                },"width":130,"bSortable": false},
                {"data": function(data){
                	if(!data.litpic) return '';
                	var litpic = data.litpic.split(",");
                	if(litpic.length < 3) return '';
                	return "<div style='overflow: hidden;height:90px;width:126px;background: #ffffff;' name='picture'><img name='s3' src='"+litpic[2]+"'/></div>";
                },"width":130,"bSortable": false},
                {"data": "spidertime","bSortable": true,"width":60},
                {"data": "createTime","bSortable": true,"width":70},
                {"data": function(data){
                	return "&nbsp;&nbsp;<input type='checkbox' data-ismake='"+data.ismake+"' data-flag='"+data.flag+"' data-sortrank='"+data.sortrank+"' name='audit' value='"+data.id+"'/>&nbsp;审核&nbsp;&nbsp;&nbsp;" 
                	+ "<input type='checkbox' name='suggest' data-ismake='"+data.ismake+"' data-flag='"+data.flag+"' data-sortrank='"+data.sortrank+"' value='"+data.id+"'/>&nbsp;推荐&nbsp;&nbsp;&nbsp;&nbsp;"
    			    + "<input type='checkbox' name='del' value='"+data.id+"'/>&nbsp;删除&nbsp;&nbsp;&nbsp;&nbsp;"
					+ "<input type='checkbox' name='istop' data-sortrank='"+data.sortrank+"' data-ismake='"+data.ismake+"' data-flag='"+data.flag+"' value='"+data.id+"'/>&nbsp;置顶";
                },"bSortable": false,"width":240,"align" : 'center'},
                {"data": "typename","bSortable": false},
                {"data": "sourceweb","bSortable": false,"width":100},
                {"data": function(data){
                	if(data.ismake==0){
                		return "未审核";
                	}
                	if(data.ismake==1){
                		return "已审核";
                	}
                	return "";
                },"bSortable": false},
                {"data": function(data){
                	if(data.flag==0){
                		return "未推荐";
                	}
                	if(data.flag==1){
                		return "已推荐";
                	}
                	return "";
                },"bSortable": false},
                {"data": function(data){
                	if(data.sortrank==5){
                		return "是";
                	}
                	return "否";
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
            },
            "createdRow": function ( row, data, index) {
            	$(row).find("a[name=toggle]").bind('click',function(){$scope.toggleArticleInput(data.id)});
            	var images = $(row).find("div[name=picture]");
            	$('img', images).bind('load',function(){$scope.actionImgSetByArray2(this,data)});
            	$('img[name=s1]', images).bind('click',function(){$scope.showImageCut(this,data,1)});
            	$('img[name=s2]', images).bind('click',function(){$scope.showImageCut(this,data,2)});
            	$('img[name=s3]', images).bind('click',function(){$scope.showImageCut(this,data,3)});
            	var auditElement = $(row).find("input[name=audit]");
            	var suggestElement = $(row).find("input[name=suggest]");
            	var delElement = $(row).find("input[name=del]");
            	var istopElement = $(row).find("input[name=istop]");
            	auditElement.bind('click',function(){$scope.auditBinding(this)});
            	suggestElement.bind('click',function(){$scope.suggestBinding(this)});
            	delElement.bind('click',function(){$scope.delBinding(this)});
            	istopElement.bind('click',function(){$scope.istopBinding(this)});
                return row;
            }
        });
        
        $scope.oTable = oTable;
        var tableColumnToggler = $('#sampleArticle_column_toggler');

        var tableWrapper = $('sampleArticle_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown

        var tableColumnCheckbox = $('input[type="checkbox"]', tableColumnToggler);
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
    
    $scope.initForm();
 	$scope.restoreFormData();
    $scope.initTable();
    $scope.initCheckBox();
    locals.clearAll();
    $('.dataTables_scrollBody').bind("scroll",function() {
    	var scroll = $('.dataTables_scrollBody').scrollTop();
    	if(scroll!=0) locals.setSession('article_dataTables_scroll',scroll);
    });
    //$scope.scanImgSetWH();
}]);