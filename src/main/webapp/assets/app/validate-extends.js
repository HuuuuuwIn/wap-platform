jQuery.validator.addMethod("jscode", function(value, element) {
	var r = $('select[name=adverttype]').val();
    if(r==0){
    	return true;
    }
    return $('#jscode').val() != '';
}, "请输入js代码");
jQuery.validator.addMethod("adverturl", function(value, element) {
	var r = $('select[name=adverttype]').val();
    if(r!=0){
    	return true;
    }
    return $('#adverturl').val() != '';
}, "请输入url");
jQuery.validator.addMethod("advertwidth", function(value, element) {
	var r = $('select[name=adverttype]').val();
    if(r==0){
    	return true;
    }
    return $('#advertwidth').val() != '';
}, "请输入广告宽度");
jQuery.validator.addMethod("advertheight", function(value, element) {
	var r = $('select[name=adverttype]').val();
    if(r==0){
    	return true;
    }
    return $('#advertheight').val() != '';
}, "请输入广告高度");
jQuery.validator.addMethod("fileupload", function(value, element) {
	var r = $('select[name=adverttype]').val();
	var v = $('#advertimage').val();
	if(r == 0 && v==''){
		return false;
	}else{
		return true;
	}
}, "请上传广告图片");
jQuery.validator.addMethod("advertposition", function(value, element) {
    return $('input[name="advertposition"]:checked').length > 0;
}, "请输入广告位");
jQuery.validator.addMethod("arcid", function(value, element) {
    return $('input[name="arcid"]:checked').length > 0;
}, "请输入栏目位");