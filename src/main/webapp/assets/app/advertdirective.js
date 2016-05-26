MetronicApp.directive('advertUpload', function () {
    return {
        restrict:'EA',
        link: function (scope, elm, attr) {
        	var imageUpload = angular.element($(elm[0]));
			imageUpload.fileupload({
				dataType : 'json',
				add : function(e, data) {
					var size = data.files[0].size / 1024;
					if (size >= 200) {
						zzcmAlert("图片大小必须在200kb以内");
						return;
					}
					data.submit();
				},
				done : function(e, data) {
					scope.$apply(function() {
								scope.formData.advertimage = data.result.fileName;
								$('#advertimage').val(data.result.fileName);
							});
					$("#fileupload").valid();
				},
				progressall : function(e, data) {
					var progress = parseInt(data.loaded / data.total * 100, 10);
					$('.progress .progress-bar').css('width', progress + '%');
				}
			});
        }
    }
})

MetronicApp.directive('positionAll', function () {
    return {
		restrict : 'A',
		link : function(scope, elm, attr) {
			var elmt = angular.element($(elm[0]));
			elmt.on('click',function(){
				var b = this.checked;
				scope.$apply(function() {
					scope.formData.checked = {
						1 : b,
						2 : b,
						3 : b,
						4 : b,
						5 : b,
						6 : b,
						7 : b
					};
				});
			});
		}
	}
})

MetronicApp.directive('arcAll', function () {
    return {
		restrict : 'A',
		link : function(scope, elm, attr) {
			var elmt = angular.element($(elm[0]));
			elmt.on('click',function(){
				var b = this.checked;
				scope.$apply(function() {
					angular.forEach(scope.arcData,function(v,i){
						v.checked = b;
					});
				});
			});
		}
	}
})