var CountryAdd = function () {
    // validation using icons
    var handleValidation2 = function() {
        // for more info visit the official plugin documentation: 
            // http://docs.jquery.com/Plugins/Validation

            var form2 = $('#form_sample_2');
            var error2 = $('.alert-danger', form2);
            var success2 = $('.alert-success', form2);

            form2.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",  // validate all fields including form hidden input
                rules: {
                    countryname: {
                        minlength: 2,
                        required: true
                    },
                    countrycode: {
                        minlength: 2,
                        required: true
                    }
                },
                messages:{
                    countryname: {
                        minlength: jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),
                        required: "必选字段"
                    },
                    countrycode: {
                        minlength: jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),
                        required: "必选字段"
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit              
                    success2.hide();
                    error2.show();
                    Metronic.scrollTo(error2, -200);
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
                    success2.show();
                    error2.hide();
                    
                    angular.element($('#CountryAddController')).scope().processForm();
                }
            });


    }

    return {
        init: function () {
            handleValidation2();
        }
    };

}();