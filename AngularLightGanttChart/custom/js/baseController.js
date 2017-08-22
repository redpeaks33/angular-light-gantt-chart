var main = angular.module("app", ['infinite-scroll', 'angularMoment']);

main.controller('baseController', ['$scope', '$timeout', '$window', function ($scope, $timeout, $window) {
    $scope.collection = [];
    $scope.colArray = [];

    $scope.start_ms = {};
    $scope.elapsed_ms = {};
    $scope.totalDisplayed = 40;


    $scope.initialize = function()
    {
        createRandomList();

        $scope.start_ms = new Date().getTime();
        $timeout(function () {
            $scope.elapsed_ms = new Date().getTime() - $scope.start_ms;
            $scope.$broadcast('setChartData', $scope.collection);
        });
    
    }

    //#region Random List
    function createRandomList() {
        for (var j = 0; j < 10; j++) {
            $scope.collection.push(createRandomItem(j));
        };
        //column
        //r100 c35 -> 7
        //r100 c 5 -> 2
        //r10  c35 -> 1.0
        //r10  c 5 -> 0.3
        for (var j = 0; j < 35; j++) {
            $scope.colArray.push(j);
        };
    }
    var
        nameList = [{ id: 1, name: 'Pierre' }, { id: 2, name: 'Pol' }, { id: 3, name: 'Jacques' }, { id: 4, name: 'Robert' }, { id: 5, name: 'Elisa' }],
        familyName = [{ id: 1, name: 'Dupont' }, { id: 2, name: 'Germain' }, { id: 3, name: 'Delcourt' }, { id: 4, name: 'bjip' }, { id: 5, name: 'Menez' }],
        nationList = [{ id: 1, name: 'USA' }, { id: 2, name: 'France' }, { id: 3, name: 'Germany' }],
        educationList = [{ id: 1, name: 'Doctorate' }, { id: 2, name: 'Master' }, { id: 3, name: 'Bachelor' }, { id: 4, name: 'High school' }];

    function createRandomItem(index) {

        var firstName = nameList[Math.floor(Math.random() * 5)],
          lastName = familyName[Math.floor(Math.random() * 5)],
          nationality = nationList[Math.floor(Math.random() * 3)],
          education = educationList[Math.floor(Math.random() * 4)];

        return {
            id: index,
            firstName: firstName,
            lastName: lastName,
            nationality: nationality,
            education: education,
            start: getRandomDate(moment(), moment().add(15,'days')),
            end: getRandomDate(moment().add(16, 'days'), moment().add(25, 'days')),
            target: moment().add(18, 'days'),
        };
    }
    //#endregion Random List
    function getRandomDate(s, e) {
        return moment(s + Math.random() * (e - s));
    }
}]);

main.directive('scroll', [function() {
    return {
        link: function (scope, elem, attrs) {
            var raw = elem[0];
            elem.bind('scroll', function () {
                if (raw.scrollHeight - raw.scrollTop - raw.offsetHeight <= 0) { //at the bottom
                    alert();
                }
            });
        }
    }
}]);