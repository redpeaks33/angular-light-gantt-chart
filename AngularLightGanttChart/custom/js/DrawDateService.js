main.service('DrawDateService', function () {
    //#region draw axis
    this.drawDate = function (context, chartSizeInfo, tableSizeInfo) {
        let g = new createjs.Graphics();

        drawDay(g, chartSizeInfo, tableSizeInfo,context)
        drawWeek(g, chartSizeInfo, tableSizeInfo,context)
        //drawAxisX(g, chartSizeInfo, tableSizeInfo);
        //drawAxisY(g, chartSizeInfo, tableSizeInfo);

        var s = new createjs.Shape(g);
        s.draw(context);
    }
    function drawDay(g, chartSizeInfo, tableSizeInfo, context) {
        context.textAlign = 'center';
        context.font = "16px Georgia";
        for(var i = 0;i<31;i++){
            context.fillText(i, i*30 + 15 , 50);
        }
    }
    
    function drawWeek(g, chartSizeInfo, tableSizeInfo, context) {
        context.textAlign = 'center';
        context.font = "16px Georgia";
        for (var i = 0; i < 7; i++) {
            context.fillText(i, i * 210 + 105, 25);
        }
    }

    function drawAxisX(g, chartSizeInfo, tableSizeInfo) {
        let xBase = tableSizeInfo.headerBottomWidth;
        let span = tableSizeInfo.rowHeight - tableSizeInfo.rowBottomWidth;
        let axisCount = tableSizeInfo.rowCount;
        let startX = 0;
        for (let i = 0; i < tableSizeInfo.rowCount; i++) {
            if (i == 2) {
                //base axis
                g.s("Gray").setStrokeDash([1, 0], 0).setStrokeStyle(2);
            }
            else {
                //sub axis
                g.s("Gray").setStrokeDash([1, 0], 0).setStrokeStyle(0.5); //color dot thickness
            }
            g.mt(startX, xBase + i * span);
            g.lt(chartSizeInfo.canvasSizeX, xBase + i * span);
        }
    }

    function drawAxisY(g, chartSizeInfo, tableSizeInfo) {
        let base = chartSizeInfo.axisYPadding;
        let span = 30;
        let axisCount = ~~(chartSizeInfo.canvasSizeX / span);
        let endP = 0;
        for (let i = 0; i < axisCount; i++) {
            if (i == 0) {
                //base axis
                g.s("Gray").setStrokeDash([1, 0], 0).setStrokeStyle(2);
                endP = chartSizeInfo.canvasSizeY;
                g.mt(base + i * span, 0);
                g.lt(base + i * span, endP);
            }
            else if (1 != 0 && i % 7 == 0) {
                //base axis
                g.s("Gray").setStrokeDash([1, 0], 0).setStrokeStyle(1);
                endP = chartSizeInfo.canvasSizeY;
                g.mt(base + i * span, 0);
                g.lt(base + i * span, endP);
            }
            else {
                g.s("Gray").setStrokeDash([4, 0], 0).setStrokeStyle(0.5)
                g.mt(base + i * span, tableSizeInfo.headerHeight / 2);
                g.lt(base + i * span, tableSizeInfo.headerHeight);

                g.s("Gray").setStrokeDash([4, 2], 0).setStrokeStyle(1); //color dot thickness
                endP = chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding;
                g.mt(base + i * span, tableSizeInfo.headerHeight);
                g.lt(base + i * span, endP);
            }
        }
    }
    //#endregion

});