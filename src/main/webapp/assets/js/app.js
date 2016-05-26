/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize"
]);
var permissionList,userName,userId;
/* add */
/* load permissions */
angular.element(document).ready(function(){
    $.getJSON('/user/info',function(data){
        userName = data.userName;
        userId = data.userId;
        permissionList = data.permissions;
        angular.bootstrap(document,['MetronicApp']);
    });
});

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    });
}]);

MetronicApp.config(function($httpProvider){
    $httpProvider.responseInterceptors.push('securityInterceptor');
}).provider('securityInterceptor',function(){
    this.$get=function($location,$q){
      return function(promise){
          return promise.then(null,function(response){
              if(response.status === 403||response.status === 401){
                  $location.path('/unauthorized')
              }
              return $q.reject(response);
          });
      };
    };
});

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

MetronicApp.factory('locals',['$window',function($window){
    return {
        //存储单个属性
        set :function(key,value){
            $window.localStorage[key]=value;
        },
        //读取单个属性
        get:function(key,defaultValue){
            return  $window.localStorage[key] || defaultValue;
        },
        //存储对象，以JSON格式存储
        setObject:function(key,value){
            $window.localStorage[key]=JSON.stringify(value);
        },
        //读取对象
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        clear:function(key){
        	$window.localStorage.removeItem(key);
        },
        clearAll:function(){
        	$window.localStorage.clear();
        },
        setSession:function(key,value){
            $window.sessionStorage[key]=value;
        },
        //读取单个属性
        getSession:function(key,defaultValue){
            return  $window.sessionStorage[key] || defaultValue;
        },
        clearSession:function(key){
            $window.sessionStorage.removeItem(key);
        },
        clearAllSession:function(){
            $window.sessionStorage.clear();
        },
        setCookie:function(key,value,days){
            var exDate = new Date();
            exDate.setDate(exDate.getDate()+days);
            document.cookie = key+"="+escape(value)+((days==null) ? "" : ";expires="+exDate.toGMTString());
        },
        //读取单个属性
        getCookie:function(key,defaultValue){
            if (document.cookie.length>0)
            {
                var c_start=document.cookie.indexOf(key + "=")
                if (c_start!=-1)
                {
                    c_start=c_start + key.length+1
                    var c_end=document.cookie.indexOf(";",c_start)
                    if (c_end==-1) c_end=document.cookie.length
                    return unescape(document.cookie.substring(c_start,c_end))
                }
            }
            return defaultValue;
        }
    }
}]);

MetronicApp.factory('permissions',function($rootScope,locals){
    var key = "perms";
    var noPerms = "noPerms";
    return {
        setPermissions:function(permissions){
            locals.setCookie(key,permissions,1);
            $rootScope.$broadcast('permissionsChanged');
        },
        hasPermission:function(permission){
            var perms = locals.getCookie(key);
            //var perm = perms.split(",");
            var pms = permission.split(",");
            for (var i = 0; i < pms.length; i++) {
            	if(perms.indexOf(pms[i].trim())>-1) return true;
            	//for (var j = 0; j < perm.length; j++) {
	    			//if(perm[j].indexOf(pms[i].trim())>-1){
		            //    return true;
		           // }
	        	//}
            }
        	return false;
        },
        getPermissions:function(){
            return locals.getCookie(key);

        },
        clearPermissions:function(){
            locals.setCookie(key,noPerms,1);
            $rootScope.$broadcast('permissionsChanged');
        },
        noPermissions:function(){
            return noPerms==locals.getCookie(key);
        }
    };
});

MetronicApp.directive('hasPermission',['permissions', function (permissions) {
    return {
        link:function(scope, element, attrs) {
            if(!angular.isString(attrs.hasPermission))
                throw "hasPermission value must be a string";

            var value = attrs.hasPermission.trim();
            var notPermissionFlag = value[0] === '!';
            if(notPermissionFlag) {
                value = value.slice(1).trim();
            }
            function toggleVisibilityBasedOnPermission() {
                var hasPermission = permissions.hasPermission(value);
                if(hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag)
                    element.show();
                else{
                    //element.hide();
                    element.remove();
                }
            }
            toggleVisibilityBasedOnPermission();
            scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
        }
    };
}]);

MetronicApp.directive('applyUniform',function($timeout){
    return {
        restrict:'A',
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {
            element.uniform({useID: false});
            scope.$watch(function() {return ngModel.$modelValue}, function() {
                $timeout(jQuery.uniform.update, 0);
            } );
        }
    };
});

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope','$location','$state','permissions', function($scope, $rootScope,$location,$state,permissions) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
    //$stateChangeStart
    //$routeChangeStart
    $scope.$on('$stateChangeStart',function(event,toState,toParams,fromState,fromParams){
        if(permissions.noPermissions()){
            event.preventDefault();
            window.location.href="/user/logout";
            return;
        }
    	var permission = toState.data.permission;
    	var flag = false;
    	if(!angular.isString(permission)){
    		flag = true;
    	}
    	if(!flag){
    		flag = permissions.hasPermission(permission);
    		/*var pers = permission.split(",");
    		for (var i = 0; i < pers.length; i++) {
	        	if(permissions.hasPermission(pers[i])){
	        		flag = true;
	        		break;
	        	}
        	}*/
    	}
        if(!flag){
        	event.preventDefault();
            $state.go('unauthorized');
        }
    });
    
    $scope.go = function(url,data){
        $state.go(url,data);
    };

    $scope.logout = function(){
        permissions.clearPermissions();
        window.location.href="/user/logout";
    };

}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(function($stateProvider, $urlRouterProvider) {

    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/articlelist");

    $stateProvider

        // unauthorized
        .state('unauthorized', {
            url: "/unauthorized",
            templateUrl: "views/401.html",
            data: {pageTitle: '401'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/admin/pages/css/error.css',

                            '/assets/js/controllers/DashboardController.js'
                        ]
                    });
                }]
            }
        })

        // Dashboard
        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/morris/morris.css',
                            '../../assets/admin/pages/css/tasks.css',
                            
                            '../../assets/global/plugins/morris/morris.min.js',
                            '../../assets/global/plugins/morris/raphael-min.js',
                            '../../assets/global/plugins/jquery.sparkline.min.js',

                            '../../assets/admin/pages/scripts/index3.js',
                            '../../assets/admin/pages/scripts/tasks.js',

                             '/assets/js/controllers/DashboardController.js'
                        ] 
                    });
                }]
            }
        })

        // AngularJS plugins
        .state('fileupload', {
            url: "/file_upload.html",
            templateUrl: "views/file_upload.html",
            data: {pageTitle: 'AngularJS File Upload'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            '../../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js'
                        ] 
                    }, {
                        name: 'MetronicApp',
                        files: [
                            '/assets/js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Select
        .state('uiselect', {
            url: "/ui_select.html",
            templateUrl: "views/ui_select.html",
            data: {pageTitle: 'AngularJS Ui Select'},
            controller: "UISelectController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        files: [
                            '../../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            '../../assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                        ] 
                    }, {
                        name: 'MetronicApp',
                        files: [
                            '/assets/js/controllers/UISelectController.js'
                        ] 
                    }]);
                }]
            }
        })

        // UI Bootstrap
        .state('uibootstrap', {
            url: "/ui_bootstrap.html",
            templateUrl: "views/ui_bootstrap.html",
            data: {pageTitle: 'AngularJS UI Bootstrap'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '/assets/js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Tree View
        .state('tree', {
            url: "/tree",
            templateUrl: "views/tree.html",
            data: {pageTitle: 'jQuery Tree View'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/jstree/dist/themes/default/style.min.css',

                            '../../assets/global/plugins/jstree/dist/jstree.min.js',
                            '../../assets/admin/pages/scripts/ui-tree.js',
                            '/assets/js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })     

        // Form Tools
        .state('formtools', {
            url: "/form-tools",
            templateUrl: "views/form_tools.html",
            data: {pageTitle: 'Form Tools'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '../../assets/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                            '../../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../../assets/global/plugins/typeahead/typeahead.css',

                            '../../assets/global/plugins/fuelux/js/spinner.min.js',
                            '../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../../assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '../../assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '../../assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '../../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '../../assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                            '../../assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '../../assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '../../assets/global/plugins/typeahead/handlebars.min.js',
                            '../../assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            '../../assets/admin/pages/scripts/components-form-tools.js',

                            '/assets/js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })        

        // Date & Time Pickers
        .state('pickers', {
            url: "/pickers",
            templateUrl: "views/pickers.html",
            data: {pageTitle: 'Date & Time Pickers'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/clockface/css/clockface.css',
                            '../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
                            '../../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../../assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                            '../../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../../assets/global/plugins/clockface/js/clockface.js',
                            '../../assets/global/plugins/bootstrap-daterangepicker/moment.min.js',
                            '../../assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js',
                            '../../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../../assets/admin/pages/scripts/components-pickers.js',

                            '/assets/js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Custom Dropdowns
        .state('dropdowns', {
            url: "/dropdowns",
            templateUrl: "views/dropdowns.html",
            data: {pageTitle: 'Custom Dropdowns'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/bootstrap-select/bootstrap-select.min.css',
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/jquery-multi-select/css/multi-select.css',

                            '../../assets/global/plugins/bootstrap-select/bootstrap-select.min.js',
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',

                            '../../assets/admin/pages/scripts/components-dropdowns.js',

                            '/assets/js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        }) 

        // Advanced Datatables
        .state('datatablesAdvanced', {
            url: "/datatables/advanced.html",
            templateUrl: "views/datatables/advanced.html",
            data: {pageTitle: 'Advanced Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            '/assets/js/scripts/table-advanced.js',

                            '/assets/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // managered Datatables
        .state('datatablesManaged', {
            url: "/datatables/managed.html",
            templateUrl: "views/datatables/managed.html",
            data: {pageTitle: 'Advanced Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            '/assets/js/scripts/table-managed.js',

                            '/assets/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Ajax Datetables
        .state('datatablesAjax', {
            url: "/datatables/ajax.html",
            templateUrl: "views/datatables/ajax.html",
            data: {pageTitle: 'Ajax Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

                            '../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',

                            '../../assets/global/scripts/datatable.js',
                            'js/scripts/table-ajax.js',

                            '/assets/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'User Profile'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',  
                        files: [
                            '../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../../assets/admin/pages/css/profile.css',
                            '../../assets/admin/pages/css/tasks.css',
                            
                            '../../assets/global/plugins/jquery.sparkline.min.js',
                            '../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../../assets/admin/pages/scripts/profile.js',

                            '/assets/js/controllers/UserProfileController.js'
                        ]                    
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {pageTitle: 'User Profile'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {pageTitle: 'User Help'}      
        })

        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/todo.html",
            data: {pageTitle: 'Todo'},
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        files: [
                            '../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/admin/pages/css/todo.css',
                            
                            '../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../../assets/global/plugins/select2/select2.min.js',

                            '../../assets/admin/pages/scripts/todo.js',

                            '/assets/js/controllers/TodoController.js'
                        ]                    
                    });
                }]
            }
        })

        // country test
        .state('country', {
            url: "/country.html",
            templateUrl: "views/country.html",
            data: {pageTitle: 'Country'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            '/assets/js/scripts/country.js',

                            '/assets/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        .state('country2', {
            url: "/country2.html",
            templateUrl: "views/country2.html",
            data: {pageTitle: 'Country2'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            '/assets/js/scripts/country2.js',

                            '/assets/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Form Tools
        .state('countryAdd', {
            url: "/countryAdd.html",
            templateUrl: "views/country/add.html",
            data: {pageTitle: 'Country Add',permission: "country:save"},
            controller: "CountryAddController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.css',
                            '../../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',

                            '../../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../../assets/global/plugins/jquery-validation/js/additional-methods.min.js',
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../../assets/global/plugins/bootstrap-wysihtml5/wysihtml5-0.3.0.js',
                            '../../assets/global/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.js',
                            '../../assets/global/plugins/ckeditor/ckeditor.js',
                            '../../assets/global/plugins/bootstrap-markdown/js/bootstrap-markdown.js',
                            '../../assets/global/plugins/bootstrap-markdown/lib/markdown.js',
                            '/assets/js/scripts/country/add.js',

                            '/assets/js/controllers/country/add.js'
                        ]
                    }]);
                }]
            }
        })

        .state('userList', {
            url: "/user/list.html",
            templateUrl: "views/user/list.html",
            data: {pageTitle: '用户列表',permission: "user:query"},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                            //'../../assets/global/plugins/bootstrap-modal/css/bootstrap-modal-bs3patch.css',
                            //'../../assets/global/plugins/bootstrap-modal/css/bootstrap-modal.css',

                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            //'../../assets/global/plugins/bootstrap-modal/js/bootstrap-modalmanager.js',
                            //'../../assets/global/plugins/bootstrap-modal/js/bootstrap-modal.js',
                            '/assets/js/scripts/user/list.js',

                            '/assets/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        .state('userAdd', {
            url: "/user/add.html",
            templateUrl: "views/user/add.html",
            data: {pageTitle: '用户添加',permission: "user:add"},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.css',
                            '../../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',

                            '../../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../../assets/global/plugins/jquery-validation/js/additional-methods.min.js',
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../../assets/global/plugins/bootstrap-wysihtml5/wysihtml5-0.3.0.js',
                            '../../assets/global/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.js',
                            '../../assets/global/plugins/ckeditor/ckeditor.js',
                            '../../assets/global/plugins/bootstrap-markdown/js/bootstrap-markdown.js',
                            '../../assets/global/plugins/bootstrap-markdown/lib/markdown.js',
                            '/assets/js/scripts/user/add.js',

                            '/assets/js/controllers/user/add.js'
                        ]
                    }]);
                }]
            }
        })

        .state('permList', {
            url: "/perm/list.html",
            templateUrl: "views/perm/list.html",
            data: {pageTitle: '权限列表',permission: "perm:query"},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            '/assets/js/scripts/perm/list.js',

                            '/assets/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        .state('permAdd', {
            url: "/perm/add.html",
            templateUrl: "views/perm/add.html",
            data: {pageTitle: '权限添加',permission: "perm:add"},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.css',
                            '../../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',

                            '../../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../../assets/global/plugins/jquery-validation/js/additional-methods.min.js',
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../../assets/global/plugins/bootstrap-wysihtml5/wysihtml5-0.3.0.js',
                            '../../assets/global/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.js',
                            '../../assets/global/plugins/ckeditor/ckeditor.js',
                            '../../assets/global/plugins/bootstrap-markdown/js/bootstrap-markdown.js',
                            '../../assets/global/plugins/bootstrap-markdown/lib/markdown.js',
                            '/assets/js/scripts/perm/add.js',

                            '/assets/js/controllers/perm/add.js'
                        ]
                    }]);
                }]
            }
        })

        .state('permUpdate', {
            url: "/perm/update/:id",
            templateUrl: "views/perm/add.html",
            data: {pageTitle: '权限添加',permission: "perm:update"},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.css',
                            '../../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',

                            '../../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../../assets/global/plugins/jquery-validation/js/additional-methods.min.js',
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../../assets/global/plugins/bootstrap-wysihtml5/wysihtml5-0.3.0.js',
                            '../../assets/global/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.js',
                            '../../assets/global/plugins/ckeditor/ckeditor.js',
                            '../../assets/global/plugins/bootstrap-markdown/js/bootstrap-markdown.js',
                            '../../assets/global/plugins/bootstrap-markdown/lib/markdown.js',
                            '/assets/js/scripts/perm/add.js',

                            '/assets/js/controllers/perm/add.js'
                        ]
                    }]);
                }]
            }
        })

        .state('roleList', {
            url: "/role/list.html",
            templateUrl: "views/role/list.html",
            data: {pageTitle: '角色列表',permission: "role:query"},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            '/assets/js/scripts/role/list.js',

                            '/assets/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        .state('roleAdd', {
            url: "/role/add.html",
            templateUrl: "views/role/add.html",
            data: {pageTitle: '角色添加',permission: "role:add"},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.css',
                            '../../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',

                            '../../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../../assets/global/plugins/jquery-validation/js/additional-methods.min.js',
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../../assets/global/plugins/bootstrap-wysihtml5/wysihtml5-0.3.0.js',
                            '../../assets/global/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.js',
                            '../../assets/global/plugins/ckeditor/ckeditor.js',
                            '../../assets/global/plugins/bootstrap-markdown/js/bootstrap-markdown.js',
                            '../../assets/global/plugins/bootstrap-markdown/lib/markdown.js',
                            '/assets/js/scripts/role/add.js',

                            '/assets/js/controllers/role/add.js'
                        ]
                    }]);
                }]
            }
        })

        .state('roleUpdate', {
            url: "/role/update/:id",
            templateUrl: "views/role/add.html",
            data: {pageTitle: '角色修改',permission: "role:update"},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.css',
                            '../../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',

                            '../../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../../assets/global/plugins/jquery-validation/js/additional-methods.min.js',
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../../assets/global/plugins/bootstrap-wysihtml5/wysihtml5-0.3.0.js',
                            '../../assets/global/plugins/bootstrap-wysihtml5/bootstrap-wysihtml5.js',
                            '../../assets/global/plugins/ckeditor/ckeditor.js',
                            '../../assets/global/plugins/bootstrap-markdown/js/bootstrap-markdown.js',
                            '../../assets/global/plugins/bootstrap-markdown/lib/markdown.js',
                            '/assets/js/scripts/role/add.js',

                            '/assets/js/controllers/role/add.js'
                        ]
                    }]);
                }]
            }
        })

        // 栏目管理列表
        .state('arctypelist', {
            url: "/arctypelist.html",
            templateUrl: "views/app/arctypelist.html",
            data: {pageTitle: 'Category',permission: "arctype:query"},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                            //'/assets/global/plugins/bootstrap-modal/css/bootstrap-modal-bs3patch.css',
                            //'/assets/global/plugins/bootstrap-modal/css/bootstrap-modal.css',
                            '/assets/global/plugins/jstree/dist/themes/default/style.min.css',
                            
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            //'/assets/global/plugins/bootstrap-modal/js/bootstrap-modalmanager.js',
                            //'/assets/global/plugins/bootstrap-modal/js/bootstrap-modal.js',
                            '/assets/global/plugins/jstree/dist/jstree.min.js',
                            
                            '/assets/app/arctypelist.js',
                            '/assets/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })
        
        // 栏目管理添加
        .state('arctypeinput', {
            url: "/arctypeinput/:id",
            templateUrl: "views/app/arctypeinput.html",
            data: {pageTitle: '管理栏目',permission: "arctype:query,arctype:query"},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            //'../../assets/global/plugins/select2/select2.css',
                           // '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            //'../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            //'../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                            //'/assets/global/plugins/bootstrap-modal/css/bootstrap-modal-bs3patch.css',
                           // '/assets/global/plugins/bootstrap-modal/css/bootstrap-modal.css',
                            '/assets/global/plugins/jstree/dist/themes/default/style.min.css',
                            
                            //'../../assets/global/plugins/select2/select2.min.js',
                            //'../../assets/global/plugins/datatables/all.min.js',
                            //'/assets/global/plugins/bootstrap-modal/js/bootstrap-modalmanager.js',
                            //'/assets/global/plugins/bootstrap-modal/js/bootstrap-modal.js',
                            '/assets/global/plugins/jstree/dist/jstree.min.js',
                            '/assets/app/arctypeinput.js',
                            '/assets/app/arctypectrl.js'
                            //'/assets/global/plugins/jquery.bootstrap.js',
                            //'/assets/global/plugins/jquery-file-upload/js/vendor/jquery.ui.widget.js',
                            //'/assets/global/plugins/jquery-file-upload/js/jquery.iframe-transport.js',
                            //'/assets/global/plugins/jquery-file-upload/js/jquery.fileupload.js',
                            //'/assets/global/plugins/jquery.bupfile.js'
                        ]
                    });
                }]
            }
        })
        
        // 广告管理列表
        .state('advertlist', {
            url: "/advertlist",
            templateUrl: "views/app/advertlist.html",
            data: {pageTitle: '广告列表',permission: "advert:query"},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                            '/assets/app/model/Array.js',
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            '/assets/app/advertlist.js'
                        ]
                    });
                }]
            }
        })
        
        // 广告管理添加
        .state('advertinput', {
            url: "/advertinput?id",
            templateUrl: "views/app/advertinput.html",
            data: {pageTitle: '广告添加',permission: "advert:query,advert:query"},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                       		//'/assets/global/plugins/fileinput/css/fileinput.css',
                            //'../../assets/global/plugins/select2/select2.css',
                            //'../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            //'../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            //'../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                            //'/assets/global/plugins/fileinput/css/fileinput.css',
                            //'../../assets/global/plugins/select2/select2.min.js',
                            ///'../../assets/global/plugins/datatables/all.min.js',
                            //'../../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            //'/assets/global/plugins/fileinput/js/fileinput.js',
                            //'/assets/global/plugins/fileinput/js/fileinput_locale_zh.js',
                            //'../../assets/global/plugins/jquery-validation/js/additional-methods.min.js',
                            //'/assets/app/validate-extends.js',
                       		//'/assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                       		//'/assets/global/plugins/fileinput/js/fileinput.js',
                       		//'/assets/global/plugins/fileinput/js/fileinput_locale_zh.js',
                       		//'/assets/global/plugins/jquery-validation/js/additional-methods.min.js',
                       		//'/assets/app/validate-extends.js',
                    		'/assets/app/advertctrl.js',
                        	'/assets/app/advertdirective.js',
                        	'/assets/app/advertFilter.js',
                            '/assets/app/advertinput.js'
                        ]
                    });
                }]
            }
        })
        
        // 广告统计
        .state('adlist', {
            url: "/adlist",
            templateUrl: "views/app/adlist.html",
            data: {pageTitle: '广告统计',permission: "ad:query"},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                            
                            '../../assets/global/plugins/bootstrap-daterangepicker/moment.min.js',
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            '/assets/app/model/Array.js',
                            '/assets/app/adlist.js',
                            
                            '../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
                            '../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js'
                        ]
                    });
                }]
            }
        })
        
        // 广告按小时统计
        .state('adlistForHour', {
            url: "/adlistForHour?date&advid",
            templateUrl: "views/app/adlistForHour.html",
            data: {pageTitle: '广告按小时统计'},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css'
                            ,
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            '/assets/app/adlistForHour.js'
                        ]
                    });
                }]
            }
        })
        
        // 广告位统计
        .state('adposlist', {
            url: "/adposlist",
            templateUrl: "views/app/adposlist.html",
            data: {pageTitle: '广告位统计',permission: "adpos:query"},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                            
                            '../../assets/global/plugins/bootstrap-daterangepicker/moment.min.js',
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            '/assets/app/adposlist.js',
                            '../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
                            '../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js'
                        ]
                    });
                }]
            }
        })
        
        // 广告位按小时统计
        .state('adposlistForHour', {
            url: "/adposlistForHour?date&advposid",
            templateUrl: "views/app/adposlistForHour.html",
            data: {pageTitle: '新闻栏目'},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css'
                            ,
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            '/assets/app/adposlistForHour.js'
                        ]
                    });
                }]
            }
        })
        
        // 内容管理列表
        .state('articlelist', {
            url: "/articlelist",
            templateUrl: "views/app/articlelist.html",
            data: {pageTitle: '新闻栏目',permission: "article:query"},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                            '/assets/app/css/jquery.Jcrop.min.css',
                            '/assets/app/css/main.css',
                            
                            '/assets/app/model/Map.js',
                            '/assets/app/model/Array.js',
                            '/assets/app/model/Picture.js',
                            '/assets/app/plugins/jquery.Jcrop.min.js',
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            '/assets/app/articlelist.js',
                            '/assets/app/articledirective.js'
                        ]
                    });
                }]
            }
        })
        
        // 内容管理添加
        .state('articleinput', {
            url: "/articleinput?id",
            templateUrl: "views/app/articleinput.html",
            data: {pageTitle: '内容添加',permission: "article:query,article:query"},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                        	'/assets/global/plugins/jquery-file-upload/js/vendor/jquery.ui.widget.js',
                        	'/assets/global/plugins/jquery-file-upload/js/jquery.fileupload.js',
                        	'/assets/global/plugins/jstree/dist/themes/default/style.min.css',
                        	'/assets/global/plugins/jstree/dist/jstree.min.js',
                            '/assets/global/plugins/ckeditor/ckeditor.js',
                            '/assets/app/articlectrl.js',
                            '/assets/app/articledirective.js'
                        ]
                    });
                }]
            }
        })
        
        // 网站统计
        .state('countsitelist', {
            url: "/countsitelist",
            templateUrl: "views/app/countsitelist.html",
            data: {pageTitle: 'PV-UV统计',permission: "site:query"},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                            
                            '../../assets/global/plugins/bootstrap-daterangepicker/moment.min.js',
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            '../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
                            '../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '/assets/app/ctsitectrl.js',
                            '/assets/app/ctsitedirective.js'
                        ]
                    });
                }]
            }
        })
        
        // 栏目统计
        .state('countcolumnlist', {
            url: "/countcolumnlist",
            templateUrl: "views/app/countcolumnlist.html",
            data: {pageTitle: 'PV-UV统计',permission: "column:query"},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                            
                            '../../assets/global/plugins/bootstrap-daterangepicker/moment.min.js',
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            '../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
                            '../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '/assets/app/ctcolumnctrl.js',
                            '/assets/app/ctcolumndirective.js'
                        ]
                    });
                }]
            }
        })
        
        // 网站小时统计
        .state('siteHourList', {
            url: "/siteHourList?arcid&date",
            templateUrl: "views/app/siteHourList.html",
            data: {pageTitle: ''},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                            
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            '/assets/app/siteHourCtrl.js',
                            '/assets/app/siteHourdirective.js'
                        ]
                    });
                }]
            }
        })
        
        // 栏目小时统计
        .state('columnHourList', {
            url: "/columnHourList?arcid&date",
            templateUrl: "views/app/columnHourList.html",
            data: {pageTitle: ''},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            '../../assets/global/plugins/select2/select2.css',
                            '../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            '../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                            
                            '../../assets/global/plugins/select2/select2.min.js',
                            '../../assets/global/plugins/datatables/all.min.js',
                            '/assets/app/columnHourCtrl.js',
                            '/assets/app/columnHourdirective.js'
                        ]
                    });
                }]
            }
        })
});

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state",'permissions', function($rootScope, settings, $state,permissions) {
    $rootScope.$state = $state; // state to be accessed from view

    permissions.setPermissions(permissionList);
    $rootScope.userName = userName;
    $rootScope.userId = userId;
}]);