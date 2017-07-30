main.directive('ganttTerm', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
        },
        templateUrl: '/custom/html/ganttTerm.html',
        controller: ['$scope', '$timeout', 'TimePosSynchronizerService', function ($scope, $timeout, TimePosSynchronizerService) {
            $scope.$on('setItemInfo', function (e, collection) {
                $scope.collection = collection;
                TimePosSynchronizerService.myFunc(100);
            });
        }],
    };
});