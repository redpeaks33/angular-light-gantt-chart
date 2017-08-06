main.directive('ganttTable', function ($timeout,$rootScope) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
        },
        templateUrl: '/custom/html/ganttTable.html',
        controller: ['$scope', '$rootScope', 'TimePosSynchronizerService', function ($scope, $rootScope, TimePosSynchronizerService) {
            $scope.totalDisplayed = 10;
            $scope.$on('setChartData', function (e, data) {
                $scope.collection = data;
                $rootScope.$broadcast('setItemInfo', $scope.collection);
                TimePosSynchronizerService.myFunc(100);
            });

            $scope.loadMode = function () {
                $scope.totalDisplayed += 20;
                $scope.start_ms = new Date().getTime();
                $timeout(function () {
                    $scope.elapsed_ms = new Date().getTime() - $scope.start_ms;
                });
            }
            
        }],
        link: function (scope, element, attr) {
            $timeout(function () {
                let sizeInfo = {
                    rowCount:element.find('tbody').find('tr').length,
                    rowHeight:element.find('tr')[0].offsetHeight,
                    headerHeight:element.find('thead')[0].offsetHeight,
                    headerBottomWidth:2,
                    rowBottomWidth:1
                }

                $rootScope.$broadcast('setTableSize', sizeInfo);
            });
        }
    };
});
