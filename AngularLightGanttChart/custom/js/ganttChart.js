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
        controller: ['$scope', '$timeout','$window', 'DrawGridService', 'DrawDateService','TimePosSynchronizerService',
            function ($scope, $timeout, $window, DrawGridService, DrawDateService, TimePosSynchronizerService) {
            var chartSizeInfo = {
                canvasSizeX: $scope.width,
                canvasSizeY: $scope.height,
                axisXPadding:0,
                axisYPadding:0,
                xMax: $scope.width,
                xMin: 0,
                yMax: $scope.height,
                yMin: 0,
            };
            let tableSizeInfo = {};
            let termSizeInfo = {};
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
                drawBackgournd();
                drawContents();
            }

            function drawBackgournd() {
                if (!termSizeInfo.startDate)
                {
                    termSizeInfo = {
                        startDate: moment().add(-1, 'weeks').day(1),
                        termDays: 35
                    };
                }
                ctx_back.clearRect(0, 0, chartSizeInfo.canvasSizeX, chartSizeInfo.canvasSizeY);
                DrawDateService.drawDate(ctx_back, chartSizeInfo, tableSizeInfo, termSizeInfo);
                DrawGridService.drawAxis(ctx_back, chartSizeInfo, tableSizeInfo, termSizeInfo);
            }

            //#endregion

            var circleShape;
            var rectangleShape;
            function drawContents() {
                $scope.stage.removeAllChildren();
                $scope.stage.update();
                //for (var i = 0; i < tableSizeInfo.rowCount; i++) {
                //    createRectangle(i);
                //}
                _.each($scope.collection, function (n, i) {
                    createRectangle(n,i);
                });
            }

            let termContainer;
            let centerRectangle;
            let leftEdge;
            let rightEdge;
            const EDGE_WIDTH = 20;
            const CENTER_RECTANGLE_NAME = 'CENTER_RECTANGLE'
            const LEFT_EDGE_NAME = 'LEFT_EDGE'
            const RIGHT_EDGE_NAME = 'RIGHT_EDGE'

            function createRectangle(item,i) {
                var termContainer = new createjs.Container();
                termContainer.chartIndex = i;
                $scope.stage.addChild(termContainer);
                $scope.stage.enableMouseOver(20);

                let itemDateInfo = {
                    startDate : item.start,
                    endDate: item.end
                }
                let itemLength = TimePosSynchronizerService.calculateItemLength(itemDateInfo, chartSizeInfo, termSizeInfo);

                leftEdge = new createjs.Shape();
                leftEdge.name = 'LEFT_EDGE'
                leftEdge.graphics.f("Pink").rc(itemLength.x, calculateYPosition(i) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 7, 5, 0, 0, 5);

                centerRectangle = new createjs.Shape();
                centerRectangle.name = 'CENTER_RECTANGLE'
                centerRectangle.graphics.f("Pink").dr(itemLength.x + EDGE_WIDTH, calculateYPosition(i) + 3, itemLength.w - EDGE_WIDTH * 2, tableSizeInfo.rowHeight - 7);


                rightEdge = new createjs.Shape();
                rightEdge.name = 'RIGHT_EDGE'
                rightEdge.graphics.f("Pink").rc(itemLength.x + itemLength.w - EDGE_WIDTH, calculateYPosition(i) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 7, 0, 5, 5, 0);

                termContainer.addChild(leftEdge);
                termContainer.addChild(centerRectangle);
                termContainer.addChild(rightEdge);

                setRectangleEventListner(termContainer);
            }

            let dragStartPointX;
            $scope.dragStartPointX = 0;
            $scope.RECTANGLE_WIDTH = 0;
            $scope.RECTANGLE_POS_X = 0;
            $scope.NEW_POS_X = 0;
            $scope.NEW_WIDTH = 0;

            function setRectangleEventListner(element) {
                element.addEventListener("mouseover", function (e) {
                    let i = e.target.parent.chartIndex;
                    let item = $scope.collection[i];
                    let itemDateInfo = {
                        startDate: item.start,
                        endDate: item.end
                    }
                    let itemLength = TimePosSynchronizerService.calculateItemLength(itemDateInfo, chartSizeInfo, termSizeInfo);

                    if (e.target.name === LEFT_EDGE_NAME) {
                        e.target.graphics.f("Red").rc(itemLength.x, calculateYPosition(i) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 7, 5, 0, 0, 5);
                    }
                    else if (e.target.name === CENTER_RECTANGLE_NAME) {
                        e.target.graphics.f("Red").dr(itemLength.x +EDGE_WIDTH, calculateYPosition(i) +3, itemLength.w -EDGE_WIDTH * 2, tableSizeInfo.rowHeight -7);
                    }///
                    else if (e.target.name === RIGHT_EDGE_NAME) {
                        e.target.graphics.f("Red").rc(itemLength.x + itemLength.w - EDGE_WIDTH, calculateYPosition(i) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight -7, 0, 5, 5, 0);
                    }
                });

                element.addEventListener("mouseout", function (e) {
                    //Recovery
                    let i = e.target.parent.chartIndex;
                    let item = $scope.collection[i];
                    let itemDateInfo = {
                        startDate: item.start,
                        endDate: item.end
                    }
                    let itemLength = TimePosSynchronizerService.calculateItemLength(itemDateInfo, chartSizeInfo, termSizeInfo);

                    if (e.target.name === LEFT_EDGE_NAME) {
                        e.target.graphics.f("Pink").rc(itemLength.x, calculateYPosition(i) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 7, 5, 0, 0, 5);
                    }
                    else if (e.target.name === CENTER_RECTANGLE_NAME) {
                        e.target.graphics.f("Pink").dr(itemLength.x + EDGE_WIDTH, calculateYPosition(i) + 3, itemLength.w - EDGE_WIDTH * 2, tableSizeInfo.rowHeight -7);
                    }///
                    else if (e.target.name === RIGHT_EDGE_NAME) {
                        e.target.graphics.f("Pink").rc(itemLength.x + itemLength.w - EDGE_WIDTH, calculateYPosition(i) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 7, 0, 5, 5, 0);
                    }
                });

                //#region Change Item Size for Drag Event 
                //Get Start Point for drag.
                element.addEventListener("mousedown", function (e) {
                    $scope.stagemouseX = $scope.stage.mouseX;
                    $scope.eTargetX = e.target.x;
                    $scope.$apply();
                    //1.Check if click position is a left edge or a main rectangle or a right edge 
                    dragStartPointX = $scope.stage.mouseX - e.target.x;
                        $scope.RECTANGLE_POS_X = _.filter(e.target.parent.children, function (n) {
                            return n.name == CENTER_RECTANGLE_NAME;
                        })[0].graphics._instructions[1].x;

                        $scope.RECTANGLE_WIDTH = _.filter(e.target.parent.children, function (n) {
                            return n.name == CENTER_RECTANGLE_NAME;
                        })[0].graphics._instructions[1].w;
                });

                //Moving Size -> $scope.stage.mouseX - dragStartPointX
                element.addEventListener("pressmove", function (e) {
                    let chartIndex = e.target.parent.chartIndex;
                    let newRectanglePos_x = null;
                    let newLeftEdgePos_x = null;
                    let newRightEdgePos_x = null;
                    let newWidth = null;

                    if (e.target.name === LEFT_EDGE_NAME) {
                        //Move x position of Left Edge
                        newRectanglePos_x = $scope.RECTANGLE_POS_X + ($scope.stage.mouseX - dragStartPointX);
                        newLeftEdgePos_x = newRectanglePos_x - EDGE_WIDTH;
                        newWidth = $scope.RECTANGLE_WIDTH - ($scope.stage.mouseX - dragStartPointX);
                        newRightEdgePos_x = newRectanglePos_x + newWidth;
                    }
                    else if (e.target.name === CENTER_RECTANGLE_NAME) {
                        //Move x position of LeftEdge and CenterRectangle and Right Edge. No change center rectangle width.
                        newRectanglePos_x = $scope.RECTANGLE_POS_X + $scope.stage.mouseX - dragStartPointX;
                        newLeftEdgePos_x = newRectanglePos_x - EDGE_WIDTH;
                        newWidth = $scope.RECTANGLE_WIDTH;
                        newRightEdgePos_x = newRectanglePos_x + newWidth;
                    }
                    else if (e.target.name === RIGHT_EDGE_NAME) {
                        //Move x position of Right Edge
                        newRectanglePos_x = $scope.RECTANGLE_POS_X;
                        newLeftEdgePos_x = newRectanglePos_x - EDGE_WIDTH;
                        newWidth = $scope.RECTANGLE_WIDTH + ($scope.stage.mouseX - dragStartPointX);
                        newRightEdgePos_x = newRectanglePos_x + newWidth;

                    }
                    if (newWidth >= 0) {
                    _.each(e.target.parent.children, function (n) {
                        if (n.name === LEFT_EDGE_NAME) {
                            n.graphics.clear().f("Green").rc(newLeftEdgePos_x, calculateYPosition(chartIndex) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 7, 5, 0, 0, 5);
                            $scope.NEW_POS_X = newLeftEdgePos_x;
                        }
                        else if (n.name === CENTER_RECTANGLE_NAME) {
                            n.graphics.clear().f("Pink").dr(newRectanglePos_x, calculateYPosition(chartIndex) + 3, newWidth, tableSizeInfo.rowHeight - 7);
                        }///
                        else if (n.name === RIGHT_EDGE_NAME) {
                            n.graphics.clear().f("Green").rc(newRightEdgePos_x, calculateYPosition(chartIndex) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 7, 0, 5, 5, 0);
                        }
                    });
                        $scope.NEW_WIDTH = newRightEdgePos_x - newLeftEdgePos_x;
                    }
                });

                element.addEventListener("pressup", function (e) {
                    let chartIndex = e.target.parent.chartIndex;
                    if ($scope.NEW_WIDTH >= 0) {
                        $scope.collection[chartIndex] = TimePosSynchronizerService.setConvertedTerm($scope.NEW_POS_X, $scope.NEW_WIDTH, $scope.collection[chartIndex], termSizeInfo);
                        e.target.parent.removeAllChildren();
                        createRectangle($scope.collection[chartIndex], chartIndex);
                    }
                });
                //#endregion 
            }

            function calculateYPosition(index) {
                return (tableSizeInfo.headerHeight) + (tableSizeInfo.rowHeight - 1) * index;
            }

            $scope.$on('setTableSize', function (e, sizeInfo,collection) {
                tableSizeInfo = sizeInfo;
                initialize();
            })

            $scope.$on('setItemInfo', function (e, collection) {
                $scope.collection = collection;
            });

            $scope.$on('setTermInfo', function (e, termInfo) {
                termSizeInfo = termInfo;
                drawBackgournd();
                drawContents();
            });

            angular.element($window).bind('resize', function () {
                console.log('resize');
                //text date
                //textAlign center
                //textBaseline bottom
                
            });
        }],
    };
});