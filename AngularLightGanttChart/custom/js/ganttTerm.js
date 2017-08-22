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
                    today: moment(), 
                    termDays: $scope.termDays
                };
            }

            $scope.changeTerm = function (diffWeek) {
                $scope.startDate = $scope.startDate.add(diffWeek, 'weeks').startOf('isoWeek');
                $rootScope.$broadcast('setTermInfo', createTermInfo());
            }

            $scope.changeWeek = function (week) {
                $scope.termDays = week * 7;
                $rootScope.$broadcast('setTermInfo', createTermInfo());
            }
        }],
    };
});