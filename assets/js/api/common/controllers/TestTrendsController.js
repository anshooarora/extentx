angular.module('ExtentX').
    controller('TestTrendsController', ['$scope', 'Aggregates', 'TestDistribution', 'DateTime', 'LineChartSettings', 'DataPointFormat', 
      function($scope, Aggregates, TestDistribution, DateTime, LineChartSettings, DataPointFormat) {
        Aggregates.then(function(response) {
            var dataPoints = response.trendDataPoints;
            var dataPointFormat = response.trendDataPointFormat;
            var res = DateTime.sortByDate(response.testDistribution);
            
            var labels = [];
            var passed = [], failed = [], others = [];
            var length = res.length > dataPoints ? dataPoints : res.length;
            
            // function getDataPointFormat(ix) {
            //     switch(dataPointFormat) {
            //         case 'num':
            //             return ix + 1;
            //         case 'dt':
            //             var date = new Date(res[ix].report.startTime);
            //             return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
            //         default:
            //             return (new Date(res[ix].report.startTime)).toLocaleString();
            //     }
            // }

            for (var ix = length - 1; ix >= 0; ix--) {
                //labels.push(getDataPointFormat(ix));
                labels.push(DataPointFormat.getDataPointFormat(dataPointFormat, res, ix));
                
                var dist = TestDistribution.getTestDistribution(res[ix]);

                passed.push(dist.passed);
                failed.push(dist.failed);
                others.push(dist.others);
            }
            
            $scope.labels = labels;
            $scope.data = [ passed, failed, others ];
            $scope.colors = LineChartSettings.colors;
            $scope.options = LineChartSettings.options;
        });
    }]);
