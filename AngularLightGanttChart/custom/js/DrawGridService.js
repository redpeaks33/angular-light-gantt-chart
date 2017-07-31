main.service('DrawGridService', function () {
    //#region draw axis
    this.drawAxis = function (context, chartSizeInfo) {
        let g = new createjs.Graphics();

        drawAxisX(g, chartSizeInfo);
        drawAxisY(g, chartSizeInfo);

        var s = new createjs.Shape(g);
        s.draw(context);
    }

    function drawAxisX(g, chartSizeInfo) {
        let xBase = chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding;
        let span = 60;
        let axisCount = xBase / span;
        let startX = 0;
        for (let i = 0; i < axisCount; i++) {
            if (i == 0) {
                //base axis
                g.s("Gray").setStrokeDash([1, 0], 0).setStrokeStyle(2);
            }
            else {
                //sub axis
                g.s("Gray").setStrokeDash([4, 2], 0).setStrokeStyle(1); //color dot thickness
                startX = chartSizeInfo.axisXPadding;
            }
            //if ((startX * startX) + (xBase -  span) * (xBase - span) < 50 * 50)
            {
                g.mt(startX, xBase - i * span);
                g.lt(chartSizeInfo.canvasSizeX, xBase - i * span);
            }
        }
    }

    function drawAxisY(g, chartSizeInfo) {
        let base = chartSizeInfo.axisYPadding;
        let span = 30;
        let axisCount = ~~(chartSizeInfo.canvasSizeX / span);
        let endP = 0;
        for (let i = 0; i < axisCount; i++) {
            if (i == 0) {
                //base axis
                g.s("Gray").setStrokeDash([1, 0], 0).setStrokeStyle(2);
                endP = chartSizeInfo.canvasSizeY;
            }
            else {
                //sub axis
                g.s("Gray").setStrokeDash([4, 2], 0).setStrokeStyle(1); //color dot thickness
                endP = chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding;
            }
            g.mt(base + i * span, 0);
            g.lt(base + i * span, endP);
        }
    }
    //#endregion

});