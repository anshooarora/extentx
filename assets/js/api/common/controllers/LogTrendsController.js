angular.module('ExtentX').
    controller('LogTrendsController', ['$scope', 'Aggregates', 'DateTime', 'LineChartSettings', 'DataPointFormat', 
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

                passed.push(report.passChildLength);
                failed.push(report.failChildLength + report.fatalChildLength);
                others.push(report.errorChildLength + report.warningChildLength + report.skipChildLength + report.infoChildLength + report.unknownChildLength);
            }
            
            $scope.labels = labels;
            $scope.data = [ passed, failed, others ];
            $scope.colors = LineChartSettings.colors;
            $scope.options = LineChartSettings.options;
        });
    }]);