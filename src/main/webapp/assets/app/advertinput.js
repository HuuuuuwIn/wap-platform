var AdvertAdd = function () {
	var handleValidation = function() {
            var form = $('#advertForm');
            var error = $('.alert-danger', form);
            var success = $('.alert-success', form);
            form.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",  // validate all fields including form hidden input
                rules: {
                    advertname: {
                    	maxlength: 20,
                    	required: true
		            },
		            advertposition: {
		            	advertposition: true
		            },
		            arcid: {
		            	arcid: true
		            },
		            adverturl: {
		            	adverturl: true
		            },
		            advertwidth: {
		            	advertwidth: true
		            },
		            advertheight: {
		            	advertheight: true
		            },
		            jscode: {
		            	jscode : true
		            },
		            fileupload: {
		            	fileupload : true
		            }
                },
                messages:{
                    advertname: {
                        required: "必选字段",
                        maxlength: jQuery.validator.format("请输入一个 长度小于 {0} 的字符串")
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit              
                    success.hide();
                    error.show();
                    Metronic.scrollTo(error, -200);
                },

                errorPlacement: function (error, element) { // render error placement for each input type
                    var icon = $(element).parent('.input-icon').children('i');
                    icon.removeClass('fa-check').addClass("fa-warning");  
                    icon.attr("data-original-title", error.text()).tooltip({'container': 'body'});
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.form-group').removeClass("has-success").addClass('has-error'); // set error class to the control group   
                },

                unhighlight: function (element) { // revert the change done by hightlight
                    
                },

                success: function (label, element) {
                    var icon = $(element).parent('.input-icon').children('i');
                    $(element).closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
                    icon.removeClass("fa-warning").addClass("fa-check");
                },

                submitHandler: function (form) {
                    success.show();
                    error.hide();
                    angular.element($('#AdvertInputController')).scope().processForm();
                }
            });
    }
    return {
        init: function () {
            handleValidation();
        }
    };
}();