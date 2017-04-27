angular.module('ExtentX')
    .controller('AuthorController', ['$rootScope', '$scope', '$http', '$location', 'Icon', 'ChartSettings', 'BarChartSettings', 'ViewNameSetter',
    function($rootScope, $scope, $http, $location, Icon, ChartSettings, BarChartSettings, ViewNameSetter) {
        var drawChart = false;
        $scope.showAuthorPanel = false;
        $scope.setViewName = ViewNameSetter.setViewName;

        $scope.getAuthorNamesWithTestCountsByProject = function(drawChart) {
            var req = {
                method: 'GET',
                url: '/getAuthorNamesWithTestCountsByProject'
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    if (res.length > 0)
                        $scope.showAuthorPanel = true;

                    $scope.authorTestCounts = res;
                    $scope.authorTestCountLength = Object.keys(res).length;

                    if (drawChart) {
                        $scope.options = BarChartSettings.options;
                        $scope.chartWidth = document.getElementById("author-distribution-container").clientWidth - 40;

                        $scope.authorDistributionLabels = [],
                            $scope.authorDistributionData = [];
                        
                        for (var ix = 0; ix < res.length; ix++) {
                            $scope.authorDistributionLabels.push(res[ix]._id.name);
                            $scope.authorDistributionData.push(res[ix].count);
                        }
                    }
                }).
                error(function(err) {
                    console.log(err);
                });
        };

        $scope.getAuthorNamesWithFailedTestCountsByProject = function() {
            var req = {
                method: 'GET',
                url: '/getAuthorNamesWithFailedTestCountsByProject'
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    var labels = [], data = [];

                    for (var prop in res) {
                        labels.push(prop);
                        data.push(res[prop]);
                    }

                    $scope.authorFailedTestDistributionLabels = labels;
                    $scope.authorFailedTestDistributionData = data;
                });
        };

        $scope.getAuthorListByReportId = function(reportId) {
            var req = {
                method: 'POST',
                url: '/getAuthorListByReportId',
                data: {
                    query: {
                        id: reportId
                    }
                }
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    $scope.initial = true;
                    $scope.reportName = res.name;
                    $scope.authorList = res.authors;
                });
        };

        $scope.getTestsByAuthorId = function(authorId, authorName) {
            $scope.activeAuthor = authorName;

            var req = {
                method: 'POST',
                url: '/getTestsByAuthorId',
                data: {
                    query: {
                        id: authorId
                    }
                }
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    $scope.authorTests = res;
                });
        };
    }]);