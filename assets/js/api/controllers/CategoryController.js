angular.module('ExtentX')
    .controller('CategoryController', ['$rootScope', '$scope', '$http', '$location', '$sce', 'Icon', 'ChartSettings', 'BarChartSettings', 'ViewNameSetter',
    function($rootScope, $scope, $http, $location, $sce, Icon, ChartSettings, BarChartSettings, ViewNameSetter) {
        $scope.trust = $sce.trustAsHtml;
        $scope.showCategoryPanel = false;
        $scope.setViewName = ViewNameSetter.setViewName;
        $scope.options = BarChartSettings.options;

        var drawChart = false;

        $scope.$on("$destroy", function(){
            angular.element(".navbar").removeClass("hidden");
        });
        
        var catContainer = document.getElementById("category-distribution-container");
        if (catContainer !== null)
            $scope.chartWidth = catContainer.clientWidth - 40;

        $scope.getDistinctCategoryNamesByProject = function() {
            var req = {
                method: 'GET',
                url: '/getDistinctCategoryNamesByProject'
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    $scope.distinctCategoryNames = res;
                });
        };

        $scope.getCategoryNamesWithTestCountsByProject = function(drawChart) {
            var req = {
                method: 'GET',
                url: '/getCategoryNamesWithTestCountsByProject'
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    if (res.length > 0)
                        $scope.showCategoryPanel = true;

                    $scope.categoryTestCounts = res;
                    $scope.categoryTestCountLength = Object.keys(res).length;

                    if (drawChart) {
                        $scope.categoryDistributionLabels = [],
                            $scope.categoryDistributionData = [];
                        
                        var labels = [], data = [];

                        for (var prop in res) {
                            labels.push(prop);
                            data.push(res[prop]);
                        }

                        $scope.categoryDistributionLabels = labels
                        $scope.categoryDistributionData = data;
                    }
                }).
                error(function(err) {
                    console.log(err);
                });
        };

        $scope.getCategoryNamesWithFailedTestCountsByProject = function() {
            var req = {
                method: 'GET',
                url: '/getCategoryNamesWithFailedTestCountsByProject'
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    var labels = [], data = [];

                    for (var prop in res) {
                        labels.push(prop);
                        data.push(res[prop]);
                    }

                    $scope.categoryFailedTestDistributionLabels = labels;
                    $scope.categoryFailedTestDistributionData = data;
                });
        };

        $scope.getCategoryListByReportId = function(reportId) {
            var req = {
                method: 'POST',
                url: '/getCategoryListByReportId',
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
                    $scope.categoryList = res.categories;
                });
        };

        $scope.getTestsByCategoryId = function(categoryId, categoryName) {
            $scope.activeCategory = categoryName;

            var req = {
                method: 'POST',
                url: '/getTestsByCategoryId',
                data: {
                    query: {
                        id: categoryId
                    }
                }
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    $scope.categoryTests = res;
                });
        };
    }]);