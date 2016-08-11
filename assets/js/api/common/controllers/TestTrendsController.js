angular.module('ExtentX').
    controller('TestTrendsController', ['$scope', 'Aggregates', 'DateTime', 'LineChartSettings', 'DataPointFormat', 
      function($scope, Aggregates, DateTime, LineChartSettings, DataPointFormat) {
        Aggregates.then(function(response) {
            var dataPoints = response.trendDataPoints;
            var dataPointFormat = response.trendDataPointFormat;
            
            var labels = [];
            var passed = [], failed = [], others = [];
            var length = response.reports.length > dataPoints ? dataPoints : response.reports.length;

            for (var ix = length - 1; ix >= 0; ix--) {
                var report = response.reports[ix];
                
                labels.push(DataPointFormat.getDataPointFormat(dataPointFormat, report, ix));
                
                passed.push(report.passParentLength);
                failed.push(report.failParentLength + report.fatalParentLength);
                others.push(report.errorParentLength + report.warningParentLength + report.skipParentLength + report.unknownParentLength);
            }
            
            $scope.labels = labels;
            $scope.data = [ passed, failed, others ];
            $scope.colors = LineChartSettings.colors;
            $scope.options = LineChartSettings.options;
        });
    }]);
