main.service('TimePosSynchronizerService', function () {
    this.calculateItemLength = function (itemDateInfo, chartSizeInfo, termSizeInfo) {
        let dayWidth = 30;
        let paddingDay = moment(itemDateInfo.startDate).diff(moment(termSizeInfo.startDate), 'days') + 1;
        let termDay = moment(itemDateInfo.endDate).diff(moment(itemDateInfo.startDate), 'days') + 1;
        
        return { x: paddingDay * dayWidth , w: termDay * dayWidth };
    }
    this.setConvertedTerm = function (x, w, item, termSizeInfo)
    {
        //let startDate = termSizeInfo.startDate.

        item.startDate = termSizeInfo.startDate.clone().add(Math.round(w / 30), 'day');
        item.termDay = Math.round(w / 30);
        alert(item.startDate.format() + ':' + item.termDay);
    }
});