MetronicApp.controller('columnHourCtrl', ['$stateParams','$rootScope', '$scope','$http','$state', function($stateParams,$rootScope, $scope,$http,$state) {
	$scope.date = $stateParams.date
	$scope.arcid = $stateParams.arcid
}]);