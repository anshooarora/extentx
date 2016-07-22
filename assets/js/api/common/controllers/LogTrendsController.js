angular.module('ExtentX').
    controller('LogTrendsController', ['$scope', 'Aggregates', 'LogDistribution', 'DateTime', 'LineChartSettings', 'DataPointFormat', 
      function($scope, Aggregates, LogDistribution, DateTime, LineChartSettings, DataPointFormat) {
        Aggregates.then(function(response) {
            var dataPoints = response.trendDataPoints;
            var dataPointFormat = response.trendDataPointFormat;
            var res = DateTime.sortByDate(response.logDistribution);
            
            var labels = [];
            var passed = [], failed = [], others = [];
            var length = res.length > dataPoints ? dataPoints : res.length;

            for (var ix = length - 1; ix >= 0; ix--) {
                labels.push(DataPointFormat.getDataPointFormat(dataPointFormat, res, ix));
                
                var dist = LogDistribution.getLogDistribution(res[ix]);

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