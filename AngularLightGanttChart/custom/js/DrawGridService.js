main.service('DrawGridService', function () {
    //#region draw axis
    this.drawAxis = function (stage, chartSizeInfo, tableSizeInfo, termSizeInfo) {
        var container = new createjs.Container();
        stage.addChild(container);

        drawAxisX(container, chartSizeInfo, tableSizeInfo);
        drawAxisY(container, chartSizeInfo, tableSizeInfo, termSizeInfo);

        stage.update();
    }

    function drawAxisX(container, chartSizeInfo, tableSizeInfo) {
        let xBase = tableSizeInfo.headerBottomWidth;
        let span = tableSizeInfo.rowHeight - tableSizeInfo.rowBottomWidth;
        let axisCount = tableSizeInfo.rowCount;
        let startX = 0;
        for (let i = 0; i < tableSizeInfo.rowCount; i++) {
            let line = new createjs.Shape();
            container.addChild(line);
            if (i == 2) {
                //base axis
                line.graphics.s("Gray").setStrokeDash([1, 0], 0).setStrokeStyle(2);
            }
            else {
                //sub axis
                line.graphics.s("Gray").setStrokeDash([1, 0], 0).setStrokeStyle(0.5); //color dot thickness
            }
            line.graphics.mt(startX, xBase + i * span);
            line.graphics.lt(chartSizeInfo.canvasSizeX, xBase + i * span);
        }
    }

    function drawAxisY(container, chartSizeInfo, tableSizeInfo, termSizeInfo) {
        let base = chartSizeInfo.axisYPadding;
        let span = ~~(chartSizeInfo.canvasSizeX / termSizeInfo.termDays);
        let axisCount = ~~(chartSizeInfo.canvasSizeX / span);
        let endP = 0;
        for (let i = 0; i < axisCount; i++) {
            let line = new createjs.Shape();
            container.addChild(line);
            if (i == 0) {
                //base axis
                line.graphics.s("Gray").setStrokeDash([1, 0], 0).setStrokeStyle(2);
                endP = chartSizeInfo.canvasSizeY;
                line.graphics.mt(base + i * span, 0);
                line.graphics.lt(base + i * span, endP);
            }
            else if (1 != 0 && i % 7 == 0) {
                //base axis
                line.graphics.s("Gray").setStrokeDash([1, 0], 0).setStrokeStyle(1);
                endP = chartSizeInfo.canvasSizeY;
                line.graphics.mt(base + i * span, 0);
                line.graphics.lt(base + i * span, endP);
            }
            else {
                line.graphics.s("Gray").setStrokeDash([4, 0], 0).setStrokeStyle(0.5)
                line.graphics.mt(base + i * span, tableSizeInfo.headerHeight / 2);
                line.graphics.lt(base + i * span, tableSizeInfo.headerHeight);

                line.graphics.s("Gray").setStrokeDash([4, 2], 0).setStrokeStyle(1); //color dot thickness
                endP = chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding;
                line.graphics.mt(base + i * span, tableSizeInfo.headerHeight);
                line.graphics.lt(base + i * span, endP);
            }
        }
    }
    //#endregion

});