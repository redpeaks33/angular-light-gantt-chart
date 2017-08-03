main.run(function (amMoment) {
    amMoment.changeLocale('ko');
});
main.directive('ganttTerm', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
        },
        templateUrl: '/custom/html/ganttTerm.html',
        controller: ['$scope', '$timeout', '$rootScope', 'moment', function ($scope, $timeout, $rootScope, moment) {
            $scope.startDate = moment().subtract(1, 'weeks').day(1);;
            $scope.termDays = 35;
            initialize();

            function initialize() {
                $rootScope.$broadcast('setTermInfo', createTermInfo());
            };

            function createTermInfo() {
                return {
                    startDate: $scope.startDate,
                    termDays: $scope.termDays
                };
            }

            $scope.termChange = function (diffWeek) {
                $scope.startDate = $scope.startDate.add(diffWeek, 'weeks').startOf('isoWeek');
                $rootScope.$broadcast('setTermInfo', createTermInfo());
            }
        }],
    };
});