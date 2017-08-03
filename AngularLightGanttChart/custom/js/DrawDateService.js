main.service('DrawDateService', function () {
    //#region draw axis
    this.drawDate = function (context, chartSizeInfo, tableSizeInfo, termSizeInfo) {
        let g = new createjs.Graphics();

        drawDay(g, chartSizeInfo, tableSizeInfo, context, termSizeInfo)
        drawWeek(g, chartSizeInfo, tableSizeInfo, context, termSizeInfo)

        var s = new createjs.Shape(g);
        s.draw(context);
    }
    function drawDay(g, chartSizeInfo, tableSizeInfo, context, termSizeInfo) {
        context.textAlign = 'center';
        context.font = "16px Georgia";
        let startDate = termSizeInfo.startDate.clone();
        for (var i = 0; i < termSizeInfo.termDays; i++) {
            let date = startDate.toObject().date;
            if (date == 1)
            {
                let m = startDate.toObject().months + 1;
                date = m + '/' + date; //  8/1
            }
            context.fillText(date, i * 30 + 15 , 50);
            startDate.add(1, 'day');
        }
    }
    
    function drawWeek(g, chartSizeInfo, tableSizeInfo, context, termSizeInfo) {
        context.textAlign = 'center';
        context.font = "16px Georgia";
        let startDate = termSizeInfo.startDate.clone();
        for (var i = 0; i < 7; i++) {
            let weekNo = startDate.isoWeek();//get week number;
            context.fillText('W' + weekNo, i * 210 + 105, 25);
            startDate.add(7, 'day');

        }
    }

    //#endregion

});