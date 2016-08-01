angular.module('ExtentX').
    factory('DataPointFormat', function() {
        return {
            getDataPointFormat: function(dataPointFormat, res, ix) {
                switch(dataPointFormat) {
                    case 'num':
                        return ix + 1;
                    case 'dt':
                        var date = new Date(res[ix].report.startTime);
                        return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
                    default:
                        return (new Date(res[ix].report.startTime)).toLocaleString();
                }
            }
        }
    });