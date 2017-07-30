main.directive('ganttChart', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            title: '@',
            chartid: '@',
            backgroundid: '@',
            width: '=',
            height: '=',
        },
        templateUrl: '/custom/html/ganttChart.html',
        controller: ['$scope', '$timeout', 'TimePosSynchronizerService', function ($scope, $timeout, TimePosSynchronizerService) {
            var chartSizeInfo = {
                canvasSizeX: $scope.width,
                canvasSizeY: $scope.height,
                xMax: $scope.width,
                xMin: 0,
                yMax: $scope.height,
                yMin: 0,
            };
            let tableSizeInfo = {};
            //initialize();
            var ctx = {};
            var ctx_back = {};

            function initialize() {
                //$timeout -> Execute after html tag canvas is loaded.
                $timeout(function () {
                    initializeCanvas();

                    createjs.Ticker.addEventListener("tick", handleTick);
                    createjs.Ticker.timingMode = createjs.Ticker.RAF;
                });
            }
            function handleTick() {
                $scope.stage.update(); 
            }
            //#region initialize canvas
            function initializeCanvas(canvasID) {
                //context for plot main data
                $scope.stage = new createjs.Stage($scope.chartid);
                ctx = $scope.stage.canvas.getContext('2d');

                //context for axis for main data
                $scope.stage_background = new createjs.Stage($scope.backgroundid);
                ctx_back = $scope.stage_background.canvas.getContext('2d');

                //drawWhiteCanvas();
                //drawGrid();
                drawSubContents();
            }


            //#endregion

            var circleShape;
            var rectangleShape;
            function drawSubContents() {
                for (var i = 0; i < tableSizeInfo.rowCount; i++) {
                    createRectangle(i);
                }
                //g.s("Blue").setStrokeDash([4, 2], 0).setStrokeStyle(1); //color dot thickness
                //g.drawCircle(chartSizeInfo.canvasSizeX / 2, chartSizeInfo.canvasSizeY / 2, 200);


                //var s = new createjs.Shape(g);
                //s.draw(ctx);

                ///////////////////////////////////////////////
                //g = new createjs.Graphics();

                //g.s("Green").setStrokeDash([8, 4], 0).setStrokeStyle(1); //color dot thickness
                //g.drawCircle(chartSizeInfo.canvasSizeX / 2, chartSizeInfo.canvasSizeY / 2 + 300, 200);
                //g.beginFill("Pink").drawCircle(40, 40, 30);

                //circleShape = new createjs.Shape(g);
                //$scope.stage.addChild(circleShape);
                //$scope.stage.update();
                //g = new createjs.Graphics();
                //////////////////////////////////////////////////////////////////////////////////
                //g.s("Red").setStrokeDash([8, 4], 0).setStrokeStyle(1); //color dot thickness
                //g.beginFill("Yellow").drawRect(0, 0, 120, 120);
                //g.beginFill("blue").drawRect(10, 10, 100, 100);

                //diamondShape = new createjs.Shape(g);
                //diamondShape.regX = diamondShape.regY = 60;
                //diamondShape.rotation = 45;
                //diamondShape.x = 100;
                //diamondShape.y = 100;
                //$scope.stage_sub.addChild(diamondShape);

            }
            let shape;
            function createRectangle(i) {
                var g = new createjs.Graphics();
                g.f("Pink").rr(0, calculateYPosition(i) + 3, 100, tableSizeInfo.rowHeight - 6, 5);
                shape = new createjs.Shape(g);
                setEventListner(shape);
                $scope.stage.addChild(shape);
            }
            function calculateYPosition(index)
            {
                return (tableSizeInfo.headerHeight) +
                (tableSizeInfo.rowHeight - 1) * index;
            }

            function setEventListner(shape) {
                shape.addEventListener("mousedown", function (e) {
                    dragPointX = $scope.stage.mouseX - e.target.x;
                });
                shape.addEventListener("pressmove", function (e) {
                    e.target.x = $scope.stage.mouseX - dragPointX;
                });
            }

            $scope.$on('setTableSize', function (e, sizeInfo,collection) {
                tableSizeInfo = sizeInfo;
                initialize();
            })
            $scope.$on('setItemInfo', function (e, collection) {
                $scope.collection = collection;
                TimePosSynchronizerService.myFunc(100);
            });
        }],
    };
});