angular.module('ExtentX')
    .controller('AnalysisController', ['$rootScope', '$scope', '$http', '$location', 'Icon', 'ChartSettings', 'PieChartSettings', 'LineChartSettings', 'DataPointFormat',
    function($rootScope, $scope, $http, $location, Icon, ChartSettings, PieChartSettings, LineChartSettings, DataPointFormat) {
        var length = 5;

        $scope.reportListPagination = false;
        $scope.createGrandChildChart = true;
        $scope.analysisOptions = {
            responsive: false,
            maintainAspectRatio: false,
            scales: ChartSettings.scales
        };
        $scope.colors = LineChartSettings.colors;
        $scope.datasetOverride = [
            {
                label: "Pass",
                borderWidth: 1,
                backgroundColor: 'rgba(75,192,192,0.1)',
                borderColor: '#33cc99',
                pointBackgroundColor: "#00AF9A",
                pointHoverBackgroundColor: 'rgba(75,192,192,0.1)',
                pointHoverBorderColor: "rgba(75,192,192,0.1)",
                type: 'bar'
            },
            {
                label: "Fail",
                borderWidth: 1,
                backgroundColor: 'rgba(255,90,94,.2)',
                borderColor: 'rgba(255,90,94,.5)',
                pointBackgroundColor: '#FF6347',
                pointHoverBackgroundColor: 'rgba(255,90,94,.2)',
                pointHoverBorderColor: "rgba(255,90,94,.2)",
                type: 'bar'
            },
            {
                label: "Others",
                borderWidth: 1,
                backgroundColor: 'rgba(253, 180, 92, .2)',
                borderColor: 'rgba(253, 180, 92, .3)',
                pointBackgroundColor: '#DAA520',
                pointHoverBackgroundColor: 'rgba(253, 180, 92, .2)',
                pointHoverBorderColor: "rgba(253, 180, 92, .2)",
                type: 'bar'
            },
            {
                label: "Totals",
                borderWidth: 1,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'rgba(0, 180, 92, .3)',
                pointBackgroundColor: '#DAA520',
                pointHoverBackgroundColor: 'rgba(0, 180, 92, .2)',
                pointHoverBorderColor: "rgba(0, 180, 92, .2)",
                type: 'line'
            }
        ];

        $scope.createTrendChartData = function(reportList) {
            length = $rootScope.trendDataPointLength;
            length = reportList.length < length ? reportList.length : length;
            $scope.length = length;

            var label = "";
            var labels = [], passed = [], failed = [], others = [], total = [];

            for (var ix = length - 1; ix >= 0; ix--) {
                var report = reportList[ix];
                
                label = DataPointFormat.getDataPointFormat(report, ix);
                labels.push(label);
                
                passed.push(report.passParentLength);
                failed.push(report.failParentLength + report.fatalParentLength);
                others.push(report.errorParentLength + report.warningParentLength + report.skipParentLength);
                total.push(passed[passed.length-1] + failed[failed.length-1] + others[others.length-1]);
            }

            $scope.labels = labels;
            $scope.testTrendData = [ passed, failed, others, total ];

            passed = [], failed = [], others = [], total = [];

            for (var ix = length - 1; ix >= 0; ix--) {
                var report = reportList[ix];

                passed.push(report.passChildLength);
                failed.push(report.failChildLength + report.fatalChildLength);
                others.push(report.errorChildLength + report.warningChildLength + report.skipChildLength + report.infoChildLength);
                total.push(passed[passed.length-1] + failed[failed.length-1] + others[others.length-1]);
            }

            $scope.childTrendData = [ passed, failed, others, total ];

            $scope.width = document.getElementById("test-trends-container").clientWidth - 40;
        };

        $scope.getReportTestsCounts = function() {
            var req = {
                method: "GET",
                url: "/getReportAndTestsCounts"
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    $scope.reportTestCounts = res;
                }).
                error(function(err) {
                    console.log(err);
                });
        };

        $scope.getTopFailedTestsByProject = function() {
            var req = {
                method: 'GET',
                url: '/getTopFailedTestsByProject'
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    $scope.topFailedTests = res;
                }).
                error(function(err) {
                    console.log(err);
                });
        };

        $scope.getCategoryNamesWithTestCountsByProject = function() {
            var req = {
                method: 'GET',
                url: '/getCategoryNamesWithTestCountsByProject'
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    $scope.categoryTestCounts = res;
                    console.log(res);
                }).
                error(function(err) {
                    console.log(err);
                });
        };

        $scope.createReportPerformanceChart = function(reportList) {
            var perfData = [];
            for (var ix = 0; ix < reportList.length; ix++) {
                perfData.push(reportList[ix].duration);
            }

            $scope.reportPerfOptions = LineChartSettings.options;
            $scope.reportPerfData = [ perfData ];
            $scope.perfDatasetOverride = [{
                borderWidth: 1,
                backgroundColor: 'rgba(26,120,194,0.1)',
                borderColor: '#1A78C2',
                pointBackgroundColor: "#1A78C2",
                pointHoverBackgroundColor: 'rgba(75,192,192,0.1)',
                pointHoverBorderColor: "rgba(75,192,192,0.1)",
                type: 'line'
            }];
            $scope.perChartWidth = document.getElementById("report-performance-container").clientWidth - 60;
        };
    }]);