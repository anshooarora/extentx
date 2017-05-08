angular.module('ExtentX')
    .controller('ReportController', ['$rootScope', '$scope', '$http', '$location', '$timeout', 'Icon', 'PieChartSettings', 'LineChartSettings', 'ViewNameSetter',
    function($rootScope, $scope, $http, $location, $timeout, Icon, PieChartSettings, LineChartSettings, ViewNameSetter) {
        $scope.path = [ '/report-summary', '/report' ];
        $scope.page = 1;
        $scope.topReportList = [];
        $scope.length = 10;
        $scope.datasetOverride = LineChartSettings.datasetOverrideGreen;
        $scope.perfChartColWidth = 6;
        $scope.setViewName = ViewNameSetter.setViewName; 
        $scope.reportChkAllSelected = false;

        $scope.hideNav = function() {
            angular.element(".navbar").addClass("hidden");
        };

        $scope.getIcon = function(status) {
            return Icon.getIcon(status);
        };

        $scope.countChecked = function() {
            var count = 0;
            return angular.element('input:checkbox:checked').length;
        };

        $scope.getReportList = function(page) {
            $scope.page = page;
            angular.element('input:checkbox').attr('checked',false);

            var req = {
                method: 'POST',
                url: '/getReportList',
                data: {
                    query: {
                        page: $scope.page
                    }
                }
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    $rootScope.trendDataPointLength = parseInt(res.dataPointSetting.trendDataPointLength);
                    $rootScope.trendDataPointFormat = res.dataPointSetting.trendDataPointFormat;
                    
                    if ($scope.page === 1)
                        $scope.topReportList = res.reports;

                    $scope.reportList = res.reports;

                    for (var ix = 0; ix < $scope.reportList.length; ix++)
                        if ($scope.reportList[ix].grandChildLength > 0) {
                            $scope.createGrandChildChart = true;
                            break;
                        }
                    
                    if (!$scope.createGrandChildChart)
                        $scope.perfChartColWidth = 12;
                }).
                error(function(response) {
                    console.log(response);
                });
        };

        var isPageValid = false;
        for (var ix = 0; ix < $scope.path.length; ix++)
            if ($location.path() === $scope.path[ix] && window.location.href.indexOf('?') > 0 && window.location.href.split('?')[1].indexOf('id=') === 0)
                isPageValid = true;

        if (isPageValid) {
            if (window.location.href.indexOf('?') > 0)
                var id = window.location.href.split('?')[1].replace('id=', '');
            
            var req = {
                method: 'POST',
                url: '/getReportById',
                data: {
                    query: { 
                        id: id 
                    }
                }
            };
            
            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
            $http(req).
                success(function(res) {
                    $scope.report = res;
                    $rootScope.viewName = res.name;

                    if ($location.path() === "/report-summary") {
                        /* has failed tests? */
                        $scope.hasIssues = false;
                        if (res.failChildLength || res.fatalChildLength || res.errorChildLength || res.warningChildLength || res.skipChildLength)
                            $scope.hasIssues = true;

                        /* report performance chart */
                        $scope.reportPerfOptions = {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        display: false
                                    }
                                }]
                            }
                        };
                        $scope.reportPerfData = [];
                        $scope.reportPerfLabels = [];
                        res.tests.forEach(function(test) {
                            $scope.reportPerfData.push(test.duration);
                            $scope.reportPerfLabels.push(test.name);
                        });
                        $scope.reportPerfData = [ $scope.reportPerfData ];

                        /* test distribution chart */
                        $scope.labels = [ 'Pass', 'Fail', 'Fatal', 'Error', 'Warning', 'Skip' ];
                        $scope.options = PieChartSettings.options;
                        $scope.colors = PieChartSettings.colors;
                        $scope.testDistWidth = document.getElementById("report-test-distribution-container").clientWidth - 40;
                        if (res.grandChildLength > 0) {
                            $scope.element = "Scenario";
                            $scope.testDistData = [ 
                                res.passChildLength, 
                                res.failChildLength, 
                                res.fatalChildLength, 
                                res.errorChildLength,
                                res.warningChildLength, 
                                res.skipChildLength
                            ];
                        } else {
                            $scope.element = "Test";
                            $scope.testDistData = [ 
                                res.passParentLength, 
                                res.failParentLength, 
                                res.fatalParentLength, 
                                res.errorParentLength,
                                res.warningParentLength, 
                                res.skipParentLength
                            ];
                        }
                    }
                });
        }

        $scope.deleteReports = function() {
            var ids = [];
            for (var ix = 0; ix < angular.element('input:checkbox:checked').length; ix++) {
                ids.push(angular.element('input:checkbox:checked')[ix].attributes['id'].nodeValue);
            }
            
            for (var ix = 0; ix < ids.length; ix++) {
                var req = {
                    method: 'POST',
                    url: '/destroyReportAndDepsByReportId',
                    data: {
                        query: { 
                            id: ids[ix] 
                        }
                    }
                };

                $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
                $http(req).
                    success(function(res) { });
            }

            var fn = function () {
                $scope.getReportList($scope.page);
            };

            $timeout(fn, 500);
        };

        $scope.checkAll = function() {
            $scope.reportChkAllSelected = $scope.reportChkAllSelected === true ? false : true;
        };

    }]);