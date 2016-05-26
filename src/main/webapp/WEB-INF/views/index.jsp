<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE html>
<!-- 
Template Name: Metronic - Responsive Admin Dashboard Template build with Twitter Bootstrap 3.2.0
Version: 3.4
Author: KeenThemes
Website: http://www.keenthemes.com/
Contact: support@keenthemes.com
Follow: www.twitter.com/keenthemes
Like: www.facebook.com/keenthemes
Purchase: http://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469?ref=keenthemes
License: You must have a valid license purchased only from themeforest(the above link) in order to legally use the theme for your project.
-->
<!--[if IE 8]> <html lang="en" class="ie8 no-js" data-ng-app="MetronicApp"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js" data-ng-app="MetronicApp"> <![endif]-->
<!--[if !IE]><!-->
<!-- data-ng-app="MetronicApp" 手动加载ng-app -->
<html>
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<title data-ng-bind="'掌众 | ' + $state.current.data.pageTitle"></title>

<meta charset="utf-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1" name="viewport"/>
<meta http-equiv="Content-type" content="text/html; charset=utf-8">
<meta content="" name="description"/>
<meta content="" name="author"/>

<!-- BEGIN GLOBAL MANDATORY STYLES -->
<!-- http://fonts.googleapis.com/css?family=Open+Sans%3A300italic%2C400italic%2C600italic%2C300%2C400%2C600&subset=latin%2Clatin-ext&ver=4.4 -->
<%--<link href="/css/fonts.googleapis.css" rel="stylesheet" type="text/css"/>--%>
<!-- <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'> -->
<%--<link href='https://fonts.googleapis.com/css?family=Roboto+Condensed' rel='stylesheet' type='text/css'>--%>
<%--<link href='https://fonts.googleapis.com/css?family=Slabo+27px' rel='stylesheet' type='text/css'>--%>
<!-- <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'> -->
<link href="${base}/assets/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
<link href="${base}/assets/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css"/>
<link href="${base}/assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
<link href="${base}/assets/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css"/>
<%-- <link href="${base}/assets/global/plugins/fileinput/css/fileinput.css" rel="stylesheet" type="text/css"/> --%>


<!-- END GLOBAL MANDATORY STYLES -->

<!-- BEGIN DYMANICLY LOADED CSS FILES(all plugin and page related styles must be loaded between GLOBAL and THEME css files ) -->
<link id="ng_load_plugins_before"/>
<!-- END DYMANICLY LOADED CSS FILES -->

<!-- BEGIN THEME STYLES -->
<link href="${base}/assets/global/css/components.css" rel="stylesheet" type="text/css"/>
<link href="${base}/assets/global/css/plugins.css" rel="stylesheet" type="text/css"/>
<link href="${base}/assets/admin/layout2/css/layout.css" rel="stylesheet" type="text/css"/>
<link href="${base}/assets/admin/layout2/css/themes/default.css" rel="stylesheet" type="text/css" id="style_color"/>
<link href="${base}/assets/admin/layout2/css/custom.css" rel="stylesheet" type="text/css"/>
<!-- END THEME STYLES -->

<link rel="shortcut icon" href="favicon.ico"/>
</head>
<!-- END HEAD -->

<!-- BEGIN BODY -->
<!-- DOC: Apply "page-header-fixed-mobile" and "page-footer-fixed-mobile" class to body element to force fixed header or footer in mobile devices -->
<!-- DOC: Apply "page-sidebar-closed" class to the body and "page-sidebar-menu-closed" class to the sidebar menu element to hide the sidebar by default -->
<!-- DOC: Apply "page-sidebar-hide" class to the body to make the sidebar completely hidden on toggle -->
<!-- DOC: Apply "page-sidebar-closed-hide-logo" class to the body element to make the logo hidden on sidebar toggle -->
<!-- DOC: Apply "page-sidebar-hide" class to body element to completely hide the sidebar on sidebar toggle -->
<!-- DOC: Apply "page-sidebar-fixed" class to have fixed sidebar -->
<!-- DOC: Apply "page-footer-fixed" class to the body element to have fixed footer -->
<!-- DOC: Apply "page-sidebar-reversed" class to put the sidebar on the right side -->
<!-- DOC: Apply "page-full-width" class to the body element to have full width page without the sidebar menu -->
<body id="AppController" ng-controller="AppController" class="page-boxed page-sidebar-closed-hide-logo page-container-bg-solid page-sidebar-closed-hide-logo page-on-load" ng-class="{'page-sidebar-closed': settings.layout.pageSidebarClosed}">

	<!-- BEGIN PAGE SPINNER -->
	<div ng-spinner-bar class="page-spinner-bar">
		<div class="bounce1"></div>
		<div class="bounce2"></div>
		<div class="bounce3"></div>
	</div>
	<!-- END PAGE SPINNER -->

	<!-- BEGIN HEADER -->
<!-- 	<div data-ng-include="'tpl/header.html'" data-ng-controller="HeaderController" class="page-header navbar navbar-fixed-top"> -->
<!-- 	</div> -->
	<!-- END HEADER -->

	<div class="clearfix">
	</div>

	<!-- BEGIN CONTAINER container -->
	<div class="">
		<div class="page-container">
			<!-- BEGIN SIDEBAR -->
			<div data-ng-include="'tpl/sidebar.html'" data-ng-controller="SidebarController" class="page-sidebar-wrapper">
			</div>
			<!-- END SIDEBAR -->
			<div class="page-content-wrapper">
				<div class="page-content">
					<!-- BEGIN STYLE CUSTOMIZER(optional) -->
					<!-- <div data-ng-include="'tpl/theme-panel.html'" data-ng-controller="ThemePanelController" class="theme-panel hidden-xs hidden-sm">
					</div> -->
					<!-- END STYLE CUSTOMIZER -->
					<!-- BEGIN ACTUAL CONTENT -->
					<div ui-view class="fade-in-up" style="margin-right: 15px;margin-left: 15px;">
					</div> 
					<!-- END ACTUAL CONTENT -->
				</div>
			</div>
		</div>
		<!-- BEGIN FOOTER -->
		<%--<div data-ng-include="'tpl/footer.html'" data-ng-controller="FooterController" class="page-footer">--%>
		</div>
		<!-- END FOOTER -->
	</div>
	<!-- END CONTAINER -->
	<!-- alerts start -->
	<div class="modal fade bs-modal-sm" id="alert_dialog" data-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-sm">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title" id="alert_title">提示</h4>
				</div>
				<div class="modal-body" id="alert_body">
					Modal body goes here
				</div>
				<div class="modal-footer">
					<button type="button" class="btn default" data-dismiss="modal" id="alert_left">关闭</button>
				</div>
			</div>
			<!-- 			/.modal-content -->
		</div>
		<!-- 		/.modal-dialog -->
	</div>

	<div class="modal fade bs-modal-sm" id="confirm_dialog" data-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-sm">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title" id="confirm_title">提示</h4>
				</div>
				<div class="modal-body" id="confirm_body">
					Modal body goes here
				</div>
				<div class="modal-footer">
					<button type="button" class="btn default" data-dismiss="modal" id="confirm_left">关闭</button>
					<button type="button" class="btn blue" id="confirm_right">OK</button>
				</div>
			</div>
		<!-- 			/.modal-content -->
		</div>
	<!-- 		/.modal-dialog -->
	</div>
	<!-- alerts end -->
	<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->

	<!-- BEGIN CORE JQUERY PLUGINS -->
	<!--[if lt IE 9]>
	<script src="${base}/assets/global/plugins/respond.min.js"></script>
	<script src="${base}/assets/global/plugins/excanvas.min.js"></script>
	<![endif]-->
	<script src="${base}/assets/global/plugins/jquery.min.js" type="text/javascript"></script>
	<script src="${base}/assets/global/plugins/jquery-migrate.min.js" type="text/javascript"></script>
	<script src="${base}/assets/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
	<script src="${base}/assets/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
	<script src="${base}/assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
	<script src="${base}/assets/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
	<script src="${base}/assets/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
	<script src="${base}/assets/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
	<script src="${base}/assets/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
	<!-- END CORE JQUERY PLUGINS -->

	<!-- BEGIN CORE ANGULARJS PLUGINS -->
	<script src="${base}/assets/global/plugins/angularjs/angular.min.js" type="text/javascript"></script>
	<script src="${base}/assets/global/plugins/angularjs/angular-sanitize.min.js" type="text/javascript"></script>
	<script src="${base}/assets/global/plugins/angularjs/angular-touch.min.js" type="text/javascript"></script>
	<script src="${base}/assets/global/plugins/angularjs/plugins/angular-ui-router.min.js" type="text/javascript"></script>
	<script src="${base}/assets/global/plugins/angularjs/plugins/ocLazyLoad.min.js" type="text/javascript"></script>
	<script src="${base}/assets/global/plugins/angularjs/plugins/ui-bootstrap-tpls.min.js" type="text/javascript"></script>
	<!-- END CORE ANGULARJS PLUGINS -->

	<!-- BEGIN APP LEVEL ANGULARJS SCRIPTS -->
	<script src="${base}/assets/js/app.js" type="text/javascript"></script>
	<script src="${base}/assets/js/directives.js" type="text/javascript"></script>
	<!-- END APP LEVEL ANGULARJS SCRIPTS -->

	<!-- BEGIN APP LEVEL JQUERY SCRIPTS -->
	<script src="${base}/assets/global/scripts/metronic.js" type="text/javascript"></script>
	<script src="${base}/assets/admin/layout2/scripts/layout.js" type="text/javascript"></script>
	<script src="${base}/assets/admin/layout2/scripts/demo.js" type="text/javascript"></script>
	<!-- END APP LEVEL JQUERY SCRIPTS -->
	<script src="${base}/assets/global/plugins/jquery-file-upload/js/vendor/jquery.ui.widget.js" type="text/javascript"></script>
	<script src="${base}/assets/global/plugins/jquery-file-upload/js/jquery.fileupload.js"></script>
	<script src="${base}/assets/global/plugins/jquery-validation/js/jquery.validate.min.js" type="text/javascript"></script>
<%-- 	<script src="${base}/assets/global/plugins/fileinput/js/fileinput.js" type="text/javascript"></script> --%>
<%-- 	<script src="${base}/assets/global/plugins/fileinput/js/fileinput_locale_zh.js" type="text/javascript"></script> --%>
	<script src="${base}/assets/global/plugins/jquery-validation/js/additional-methods.min.js" type="text/javascript"></script>
	<script src="${base}/assets/app/validate-extends.js" type="text/javascript"></script>

	<script type="text/javascript">
		/* Init Metronic's core jquery plugins and layout scripts */
		$(document).ready(function() {
			Metronic.init(); // Run metronic theme
			Metronic.setAssetsPath('${base}/assets/'); // Set the assets folder path
		});
		function zzcmAlert(msg,title,time){
			if(null==title || undefined==title){
				$('#alert_title').html("提示");
			}else{
				$('#alert_title').html(title);
			}
			$('#alert_body').html(msg);
			$("#alert_dialog").modal('show');
			if(time){
				setTimeout(function(){
					$("#alert_dialog").modal('hide');
				},time);
			}
		}

		function zzcmConfirm(body,func,title,left,right){
			$('#confirm_right').show();
			if(null==title || undefined==title){
				$('#confirm_title').html("提示");
			}else{
				$('#confirm_title').html(title);
			}
			if(null==left || undefined==(left)){
				$('#confirm_left').html("关闭");
			}else{
				$('#confirm_left').html(left);
			}
			if(null==right || undefined==(right)){
				$('#confirm_right').html("OK");
			}else{
				$('#confirm_right').html(right);
			}
			$('#confirm_body').html(body);
			$("#confirm_dialog").modal('show');
			$('#confirm_right').unbind();
			$('#confirm_right').one("click",function(){
				$("#confirm_dialog").modal('hide');
				func();
			});
		}
	</script>
	<!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->
</html>