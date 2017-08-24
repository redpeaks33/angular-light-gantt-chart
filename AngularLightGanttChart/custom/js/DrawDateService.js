main.service('DrawDateService', function () {
    //#region draw axis
    this.drawDate = function (stage, chartSizeInfo, tableSizeInfo, termSizeInfo) {
        var container = new createjs.Container();
        stage.addChild(container);

        drawDay(container, chartSizeInfo, tableSizeInfo,termSizeInfo)
        drawWeek(container, chartSizeInfo, tableSizeInfo, termSizeInfo)

        stage.update();
    }
    function drawDay(container, chartSizeInfo, tableSizeInfo, termSizeInfo) {
        let startDate = termSizeInfo.startDate.clone();
        let span = ~~(chartSizeInfo.canvasSizeX / termSizeInfo.termDays);
        for (var i = 0; i < termSizeInfo.termDays; i++) {
            let date = startDate.toObject().date;
            if (date == 1)
            {
                let m = startDate.toObject().months + 1;
                date = m + '/' + date; //  8/1
            }
            var text = new createjs.Text(date, "20px Arial", "#ff7700");
            text.x = i * span + 15;
            text.y = 50;
            text.textBaseline = "alphabetic";

            container.addChild(text);
            startDate.add(1, 'day');
        }
    }
    
    function drawWeek(container, chartSizeInfo, tableSizeInfo, termSizeInfo) {
        let startDate = termSizeInfo.startDate.clone();
        let span = ~~(chartSizeInfo.canvasSizeX / termSizeInfo.termDays);
        for (var i = 0; i < termSizeInfo.termDays / 7; i++) {
            let weekNo = startDate.isoWeek();//get week number;
            var text = new createjs.Text('W' + weekNo, "20px Arial", "#ff7700");
            text.x = i * span * 7 + 105;
            text.y = 25;
            text.textBaseline = "alphabetic";
            container.addChild(text);
            startDate.add(7, 'day');
        }
    }

    //#endregion

});