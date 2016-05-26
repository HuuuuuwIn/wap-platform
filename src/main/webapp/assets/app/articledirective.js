MetronicApp.directive('ckEditor', function() {
	return {
		restrict:'EA',
		require: '?ngModel',
		link: function(scope, elm, attr, ngModel) {
			var ck = CKEDITOR.replace(elm[0],{height:'1000px'});
			if (!ngModel) return;
			ck.on('instanceReady', function() {
				ck.setData(ngModel.$viewValue);
			});
			function updateModel() {
				scope.$apply(function() {
					ngModel.$setViewValue(ck.getData());
				});
			}
			ck.on('pasteState', updateModel);
			ck.on('change', updateModel);
			ck.on('key', updateModel);

			ngModel.$render = function(value) {
				ck.setData(ngModel.$viewValue);
			};
		}
	};
});

MetronicApp.directive('tree', function() {
	return {
		restrict:'EA',
		link: function(scope, elm, attr) {
			var tree = angular.element($(elm[0]));
			tree.jstree({
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
				if(d.node.children.length == 0 && d.node.text != '推荐'){
					scope.$apply(function() {
						scope.formData.typeid=d.node.id;
						scope.formData.typename=d.node.text;
					});
					$('#arctypeTree').modal('hide');
				}
			});
		}
	};
});
MetronicApp.directive('articleUpload', function () {
    return {
        restrict:'EA',
        link: function (scope, elm, attr) {
        	var imageUpload = angular.element($(elm[0]));
        	imageUpload.fileupload({
	        dataType: 'json',
	        add: function (e,data) {
				var size = data.files[0].size / 1024;
				if(size>=200){
					zzcmAlert("图片大小必须在200kb以内");
					return;
				}
	        	data.submit();
	        },
	        done: function (e, data) {
	        	scope.$apply(function(){
	        		scope.formData.litpic = data.result.filePath + data.result.fileName;
	        	});
	        },
	        progressall: function (e, data) {
		        var progress = parseInt(data.loaded / data.total * 100, 10);
		        $('.progress .progress-bar').css(
		            'width',
		            progress + '%'
		        );
	   		}
	    });
         	/*imageUpload.fileinput({
				language : 'zh', // 设置语言
				filePlural: "文件",
				msgSelected: '{n} {files} 被选中',
				uploadUrl : "/upfile/uploadImage/false/false", // server
				uploadAsync : false,
				autoReplace: true,
				showPreview : true, // 显示预览
				showUpload : true, // 是否显示上传按钮
				showCaption : true,// 是否显示标题
				dropZoneEnabled : false,// 是否显示拖拽区域
				allowedFileExtensions : ['jpg', 'png', 'gif'],
				maxFileCount : 1,
				minFileCount : 1,
				maxFileSize : 200,
				enctype : 'multipart/form-data',
				browseClass : "btn btn-primary", // 按钮样式
				validateInitialCount : true,
				previewFileIcon : "<i class='glyphicon glyphicon-king'></i>"
			}).on('filebatchuploadsuccess', function(event, data) {
				scope.$apply(function(){
					scope.formData.litpic=data.response.filePath + data.response.fileName;
				});
			});*/
        }
    }
})

MetronicApp.directive('transTitle', function() {
    return {
        restrict: 'AE',
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
            scope.formData.title = scope.formData.title.replace(/&nbsp;/ig,' ');
        }
    };
});

MetronicApp.directive('jcropSelect', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
        	$(elem).change(function(){
        		scope.setJcrop(scope.cropRadio);
        		if(scope.cropRadio == 2 || scope.cropRadio == 4) {//大图
        			scope.setImagesides(scope.cropPicture,scope.bigLitpic);
    			}else{
    				scope.setImagesides(scope.cropPicture,scope.allLitpic);
    			}
        		
        	})
        	
        }
    };
});

/*MetronicApp.directive('scrollPlace', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
        	$(elem).bind("scroll",function() {
        		scope.setScroll($(elem).scrollLeft(),$(elem).scrollTop());
        	});
        }
    };
});*/

MetronicApp.directive('toggleImage', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
        	var className = attrs.class;
        	if(className == 'bar-left'){
        		$(elem).click(function(){
        			$(elem).css('visibility','visible');
        			$('.emcss[name=right]').css('visibility','visible');
        			var src = scope.cropPicture.getLeft();
        			scope.setPicture(src,'toggle');
        			scope.setJcrop(scope.cropRadio);
//        			scope.cropJcp.setImage(src);
//        			scope.setImgElement(src);
    				if(!scope.cropPicture.getLeft() || scope.cropPicture.getLeft() == ''){
    					$(elem).css('visibility','hidden');
    					$('.emcss[name=left]').css('visibility','hidden');
        			}
        		})
        	}
        	if(className == 'bar-right'){
        		$(elem).click(function(){
        			$(elem).css('visibility','visible');
        			$('.emcss[name=left]').css('visibility','visible');
        			var src = scope.cropPicture.getRight();
        			scope.setPicture(src,'toggle');
        			scope.setJcrop(scope.cropRadio);
//        			scope.cropJcp.setImage(src);
//        			scope.setImgElement(src);
        			if(!scope.cropPicture.getRight() || scope.cropPicture.getRight() == ''){
        				$(elem).css('visibility','hidden');
        				$('.emcss[name=right]').css('visibility','hidden');
        			}
        		});
        	}
        }
    };
});