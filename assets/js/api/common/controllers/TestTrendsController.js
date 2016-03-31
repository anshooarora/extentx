angular.module('ExtentX').
    controller('TestTrendsController', ['$scope', 'Aggregates', 'TestDistribution', 'DateTime', 'LineChartSettings', 
      function($scope, Aggregates, TestDistribution, DateTime, LineChartSettings) {
        Aggregates.then(function(response) {
            var res = DateTime.sortByDate(response.testDistribution);
            
            var labels = [];
            var passed = [], failed = [], others = [];
            var length = res.length > 5 ? 5 : res.length;

            for (var ix = length - 1; ix >= 0; ix--) {
                labels.push(new Date(res[ix].report.startTime).toLocaleString());
                
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
