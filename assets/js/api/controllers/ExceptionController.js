angular.module('ExtentX')
    .controller('ExceptionController', ['$rootScope', '$scope', '$http', '$location', '$sce', 'Icon', 'ChartSettings', 'BarChartSettings', 'LineChartSettings', 'PieChartSettings',
    function($rootScope, $scope, $http, $location, $sce, Icon, ChartSettings, BarChartSettings, LineChartSettings, PieChartSettings) {
        $scope.trust = $sce.trustAsHtml;
        var drawChart = false;
        $scope.exceptionCount = 0;
        $scope.showExceptionPanel = false;

        $scope.$on("$destroy", function(){
            angular.element(".navbar").removeClass("hidden");
        });
        
        $scope.getExceptionNamesWithTestCountsByProject = function(drawChart) {
            var req = {
                method: 'GET',
                url: '/getExceptionNamesWithTestCountsByProject'
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    if (res.length)
                        $scope.showExceptionPanel = true;

                    $scope.exceptionTestCounts = res;
                    $scope.exceptionTestCountLength = Object.keys(res).length;

                    if (drawChart) {
                        $scope.options = BarChartSettings.options;
                        $scope.exceptionDistributionChartWidth = document.getElementById("exception-dist-container").clientWidth - 40;

                        $scope.exceptionDistributionLabels = [],
                            $scope.exceptionDistributionData = [];
                        
                        for (var ix = 0; ix < res.length; ix++) {
                            $scope.exceptionDistributionLabels.push(res[ix]._id.name);
                            $scope.exceptionDistributionData.push(res[ix].count);
                            $scope.exceptionCount += res[ix].count;
                        }
                    }
                }).
                error(function(err) {
                    console.log(err);
                });
        };

        $scope.getExceptionDistributionByReportByProject = function(days) {
            var req = {
                method: 'POST',
                url: '/getExceptionDistributionByReportByProject'
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $scope.exceptionReportDistOptions = {
                responsive: true,
                maintainAspectRatio: false,
                scales: ChartSettings.scales
            };
            $scope.datasetOverride = LineChartSettings.datasetOverrideGreen;

            $http(req).
                success(function(res) {                    
                    $scope.exceptionReportDistLabels = [];
                    $scope.exceptionReportDistData = [];

                    for (var ix = 0; ix < res.length; ix++) {
                        $scope.exceptionReportDistLabels.push(res[ix].name);
                        $scope.exceptionReportDistData.push(res[ix].exceptionCount);
                    }

                    $scope.exceptionReportDistData = [ $scope.exceptionReportDistData ];
                }).
                error(function(err) {
                    console.log(err);
                });
        };

        $scope.getExceptionsByReportId = function(id, name) {
            $scope.reportName = name;

            var req = {
                method: 'POST',
                url: '/getExceptionsByReportId',
                data: {
                    query: {
                        reportId: id
                    }
                }
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    $scope.initial = true;
                    $scope.exceptionList = res.exceptions;
                }).
                error(function(err) {
                    console.log(err);
                });
        };

        $scope.getTestsByExceptionId = function(id, name) {
            $scope.activeException = name;

            var req = {
                method: 'POST',
                url: '/getTestsByExceptionId',
                data: {
                    query: {
                        id: id
                    }
                }
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    $scope.exceptionInfo = res;
                }).
                error(function(err) {
                    console.log(err);
                });
        };
    }]);