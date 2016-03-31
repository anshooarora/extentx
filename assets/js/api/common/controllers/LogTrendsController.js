angular.module('ExtentX').
    controller('LogTrendsController', ['$scope', 'Aggregates', 'LogDistribution', 'DateTime', 'LineChartSettings', 
      function($scope, Aggregates, LogDistribution, DateTime, LineChartSettings) {
        Aggregates.then(function(response) {
            var res = DateTime.sortByDate(response.logDistribution);
            
            var labels = [];
            var passed = [], failed = [], others = [];
            var length = res.length > 5 ? 5 : res.length;

            for (var ix = length - 1; ix >= 0; ix--) {
                labels.push(new Date(res[ix].report.startTime).toLocaleString());
                
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