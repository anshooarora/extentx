angular.module('ExtentX')
    .controller('ReportController', ['$rootScope', '$scope', '$http', 'Aggregates', 
    function($rootScope, $scope, $http, Aggregates) {
        $scope.padded = $rootScope.sideNavToggled ? 'padded': '';
        $scope.test = 'label label-primary';

        Aggregates.then(function(res) {
            $scope.res = res;
            $scope.max = res.trendDataPoints;

            $scope.hasStandard = false;
            $scope.hasBDD = false;

            for (var ix = 0; ix < res.reports.length; ix++) {
                var report = res.reports[ix];
                if (report.grandChildLength === 0) {
                    $scope.hasStandard = true;
                } else {
                    $scope.hasBDD = true;
                }
            }
        });
    }]);