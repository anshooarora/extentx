angular.module('ExtentX').
    controller('TestAnalysisController', ['$scope', 'Aggregates', 'PieChartSettings', function($scope, Aggregates, PieChartSettings) {
        Aggregates.then(function(response) {
            var testDistribution = response.testDistribution;
            var max = testDistribution.length > 4 ? 5 : testDistribution.length;

            $scope.pass = 0, $scope.fail = 0, $scope.fatal = 0, $scope.error = 0, $scope.warning = 0, $scope.skip = 0, $scope.unknown = 0;
            
            for (var ix = 0; ix < max; ix++) {
                testDistribution[ix].distribution.forEach(function(item) {
                    switch (item._id) {
                        case 'pass': $scope.pass += item.count; break;
                        case 'fail': $scope.fail += item.count; break;
                        case 'fatal': $scope.fatal += item.count; break;
                        case 'error': $scope.error += item.count; break;
                        case 'warning': $scope.warning += item.count; break;
                        case 'skip': $scope.skip += item.count; break;                        
                        case 'unknown': $scope.unknown += item.count; break;
                        default: break;
                    }
                });
            }
            
            $scope.labels = [ 'Pass', 'Fail', 'Fatal', 'Error', 'Warning', 'Skip', 'Unknown' ];
            $scope.data = [ $scope.pass, $scope.fail, $scope.fatal, $scope.error, $scope.warning, $scope.skip, $scope.unknown ];
            $scope.options = PieChartSettings.options;
            $scope.colors = PieChartSettings.colors;
        });
    }]);
