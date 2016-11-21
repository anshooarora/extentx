angular.module('ExtentX').
    factory('DataPointFormat', ['$rootScope', function($rootScope) {
        return {
            getDataPointFormat: function(report, ix) {
                switch($rootScope.trendDataPointFormat) {
                    case 'num':
                        return ix + 1;
                    case 'dt':
                        var date = new Date(report.startTime);
                        return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
                    case 'name':
                        return report.name;
                    default:
                        return (new Date(report.startTime)).toLocaleString().split(",");
                }
            }
        }
    }]);