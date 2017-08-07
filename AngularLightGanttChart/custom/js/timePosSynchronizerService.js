main.service('TimePosSynchronizerService', function () {
    this.calculateItemLength = function (itemDateInfo, chartSizeInfo, termSizeInfo) {
        let dayWidth = 30;
        let paddingDay = moment(itemDateInfo.startDate.format('YYYY/MM/DD 00:00:00')).diff(moment(termSizeInfo.startDate.format('YYYY/MM/DD 00:00:00')),'days');
        let termDay = moment(itemDateInfo.endDate.format('YYYY/MM/DD 00:00:00')).diff(moment(itemDateInfo.startDate.format('YYYY/MM/DD 00:00:00')), 'days') + 1;
        
        return { x: paddingDay * dayWidth , w: termDay * dayWidth };
    }
    this.setConvertedTerm = function (x, w, item, termSizeInfo)
    {
        let dayWidth = 30;
        item.start = termSizeInfo.startDate.clone().add(Math.round(x / dayWidth), 'day');
        item.end = item.start.clone().add(Math.round(w / 30), 'days');
        return item;
    }
});