main.service('TimePosSynchronizerService', function () {
    this.calculateItemLength = function (itemDateInfo, chartSizeInfo, termSizeInfo) {
        let dayWidth = 30;
        let paddingDay = moment(itemDateInfo.startDate).diff(moment(termSizeInfo.startDate), 'days') + 1;
        let termDay = moment(itemDateInfo.endDate).diff(moment(itemDateInfo.startDate), 'days') + 1;
        
        return { x: paddingDay * dayWidth , w: termDay * dayWidth };
    }
});