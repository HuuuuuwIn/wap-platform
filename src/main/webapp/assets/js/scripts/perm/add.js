var PermAdd = function () {
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
                    permissionSign: {
                        rangelength: [4,20],
                        required: true,
                        remote:{
                            url:"/perm/unique.json",
                            type:"post",
                            dataType:"json",
                            headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
                            data:{sign:function(){
                                return $("#sign").val();
                            },id: function () {
                                return $("#id").val();
                            }}
                        }
                    },
                    permissionName: {
                        rangelength: [2,12],
                        required: true
                    },
                    description: {
                        maxlength:50
                    },
                },
                messages:{
                    permissionSign: {
                        rangelength: jQuery.validator.format("请输入一个 长度在{0}-{1} 的字符串"),
                        required: "必选字段",
                        remote:jQuery.validator.format("权限标识重复")
                    },
                    permissionName: {
                        rangelength: jQuery.validator.format("请输入一个 长度在{0}-{1} 的字符串"),
                        required: "必选字段"
                    },
                    description: {
                        maxlength:jQuery.validator.format("最多可以输入 {0} 个字符"),
                    },
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

                    angular.element($('#PermAddController')).scope().processForm();
                }
            });


    }

    var handleWysihtml5 = function() {
        if (!jQuery().wysihtml5) {
            
            return;
        }

        if ($('.wysihtml5').size() > 0) {
            $('.wysihtml5').wysihtml5({
                "stylesheets": ["../../assets/global/plugins/bootstrap-wysihtml5/wysiwyg-color.css"]
            });
        }
    }

    return {
        //main function to initiate the module
        init: function () {

            handleWysihtml5();
            handleValidation2();

        }

    };

}();