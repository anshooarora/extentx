angular.module('ExtentX').
    controller('TestAnalysisController', ['$scope', 'Aggregates', 'PieChartSettings', function($scope, Aggregates, PieChartSettings) {
        Aggregates.then(function(response) {
            var testDistribution = response.testDistribution;
            $scope.max = response.trendDataPoints > response.reports.length ? response.reports.length : response.trendDataPoints;

            $scope.pass = 0, $scope.fail = 0, $scope.fatal = 0, $scope.error = 0, $scope.warning = 0, $scope.skip = 0, $scope.unknown = 0;
            
            for (var ix = 0; ix < $scope.max; ix++) {
                var report = response.reports[ix];

                $scope.pass += report.passParentLength;
                $scope.fail += report.failParentLength;
                $scope.fatal += report.fatalParentLength;
                $scope.error += report.errorParentLength;
                $scope.warning += report.warningParentLength;
                $scope.skip += report.skipParentLength;
                $scope.unknown += report.unknownParentLength;
            }
            
            $scope.labels = [ 'Pass', 'Fail', 'Fatal', 'Error', 'Warning', 'Skip', 'Unknown' ];
            $scope.data = [ $scope.pass, $scope.fail, $scope.fatal, $scope.error, $scope.warning, $scope.skip, $scope.unknown ];
            $scope.options = PieChartSettings.options;
            $scope.colors = PieChartSettings.colors;
        });
    }]);
