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
            let termContainer;
            let centerRectangle;
            let leftEdge;
            let rightEdge;
            const EDGE_WIDTH = 10;
            const CENTER_RECTANGLE_NAME = 'CENTER_RECTANGLE'
            const LEFT_EDGE_NAME = 'LEFT_EDGE'
            const RIGHT_EDGE_NAME = 'RIGHT_EDGE'
            function createRectangle(i) {
                //var g = new createjs.Graphics();
                //g.f("Green").rc(0, calculateYPosition(i) + 3, 10, tableSizeInfo.rowHeight - 6, 5,0,0,5);
                //rectangle = new createjs.Shape(g);
                //setRectangleEventListner(rectangle);
                //$scope.stage.addChild(rectangle);

                //var g = new createjs.Graphics();
                //g.f("Pink").dr(10, calculateYPosition(i) + 3, 100 - 20, tableSizeInfo.rowHeight - 6);
                //leftEdge = new createjs.Shape(g);
                //setLeftEdgeEventListner(leftEdge);
                //$scope.stage.addChild(leftEdge);

                //var g = new createjs.Graphics();
                //g.f("Green").rc(100 - 20 + 10, calculateYPosition(i) + 3, 10, tableSizeInfo.rowHeight - 6, 0,5,5,0);
                //rightEdge = new createjs.Shape(g);
                //setRightEdgeEventListner(rightEdge);
                //$scope.stage.addChild(rightEdge);

                var termContainer = new createjs.Container();
                termContainer.chartIndex = i;
                $scope.stage.addChild(termContainer);

                leftEdge = new createjs.Shape();
                leftEdge.name = 'LEFT_EDGE'
                leftEdge.graphics.f("Green").rc(100, calculateYPosition(i) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 6, 5, 0, 0, 5);

                centerRectangle = new createjs.Shape();
                centerRectangle.name = 'CENTER_RECTANGLE'
                centerRectangle.graphics.f("Pink").dr(100 + EDGE_WIDTH, calculateYPosition(i) + 3, 100 - 20, tableSizeInfo.rowHeight - 6);

                rightEdge = new createjs.Shape();
                rightEdge.name = 'RIGHT_EDGE'
                rightEdge.graphics.f("Green").rc(100 + 100 - 20 + EDGE_WIDTH, calculateYPosition(i) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 6, 0, 5, 5, 0);

                termContainer.addChild(leftEdge);
                termContainer.addChild(centerRectangle);
                termContainer.addChild(rightEdge);

                setRectangleEventListner(termContainer);
                //var g = new createjs.Graphics();
                //g.f("Green").rc(100, calculateYPosition(i) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 6, 5, 0, 0, 5);
                //g.f("Pink").dr(100+EDGE_WIDTH, calculateYPosition(i) + 3, 100 - 20, tableSizeInfo.rowHeight - 6);
                //g.f("Green").rc(100+ 100 - 20 + EDGE_WIDTH, calculateYPosition(i) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 6, 0, 5, 5, 0);
                //rectangle = new createjs.Shape(g);
                //setRectangleEventListner(rectangle);
                //$scope.stage.addChild(rectangle);
            }

            let dragStartPointX;
            $scope.dragStartPointX = 0;
            $scope.RECTANGLE_WIDTH = 0;
            $scope.RECTANGLE_POS_X = 0;

            function setRectangleEventListner(element) {
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
                            n.graphics.clear().f("Green").rc(newLeftEdgePos_x, calculateYPosition(chartIndex) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 6, 5, 0, 0, 5);
                        }
                        else if (n.name === CENTER_RECTANGLE_NAME) {
                            n.graphics.clear().f("Pink").dr(newRectanglePos_x, calculateYPosition(chartIndex) + 3, newWidth, tableSizeInfo.rowHeight - 6);
                        }
                        else if (n.name === RIGHT_EDGE_NAME) {
                            n.graphics.clear().f("Green").rc(newRightEdgePos_x, calculateYPosition(chartIndex) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 6, 0, 5, 5, 0);
                        }
                    });
                    }
                });

                //element.addEventListener("mouseup", function (e) {
                //    _.each(e.target.parent.children, function (n) {
                //        if (n.name === LEFT_EDGE_NAME) {
                //        }
                //        else if (n.name === CENTER_RECTANGLE_NAME) {
                //        }
                //        else if (n.name === RIGHT_EDGE_NAME) {
                //            n.graphics._instructions[1].x = ($scope.stage.mouseX - dragStartPointX) + $scope.START_POS_X;
                //            n.graphics._instructions[1].w = (-1 * ($scope.stage.mouseX - dragStartPointX)) + $scope.RECTANGLE_WIDTH;
                //        }
                //    });
                //    //Update position and width of LeftEdge and CenterRectangle and Right Edge. 
                //    //n.graphics.clear().beginFill('Red').drawRect(0, 0, ($scope.stage.mouseX - dragStartPointX) + $scope.RECTANGLE_WIDTH, 300).endFill();
                //});
            }

            //function setLeftEdgeEventListner(element) {
            //    element.addEventListener("mousedown", function (e) {
            //        dragPointX = $scope.stage.mouseX - e.target.x;
            //    });
            //    element.addEventListener("pressmove", function (e) {
            //        e.target.x = $scope.stage.mouseX - dragPointX;
            //    });
            //}

            //function setRightEdgeEventListner(element) {
            //    element.addEventListener("mousedown", function (e) {
            //        dragPointX = $scope.stage.mouseX - e.target.x;
            //    });
            //    element.addEventListener("pressmove", function (e) {
            //        e.target.x = $scope.stage.mouseX - dragPointX;
            //    });
            //}

            function calculateYPosition(index) {
                return (tableSizeInfo.headerHeight) + (tableSizeInfo.rowHeight - 1) * index;
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