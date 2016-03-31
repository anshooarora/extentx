angular.module('ExtentX')
    .controller('ReportController', ['$scope', '$http', 'Report', 'TestDistribution', 'LogDistribution', 
    function($scope, $http, Report, TestDistribution, LogDistribution) {
        var testDistribution = null, logDistribution = null;
        
        Report.then(function(res) {
            $scope.res = res;

            testDistribution = res.testDistribution;
            logDistribution = res.logDistribution;
        });
        
        $scope.getTestDistribution = function(reportId) {
            for (var ix = 0; ix < testDistribution.length; ix++)
                if (testDistribution[ix].report.id === reportId)
                    return TestDistribution.getTestDistribution(testDistribution[ix]);
        };
        
        $scope.getLogDistribution = function(reportId) {
            for (var ix = 0; ix < testDistribution.length; ix++)
                if (testDistribution[ix].report.id === reportId)
                    return LogDistribution.getLogDistribution(logDistribution[ix]);
        };
    }]);