angular.module('ExtentX').
    controller('AdminController', ['$scope', '$rootScope', '$http', '$window', function($scope, $rootScope, $http, $window) {
        $scope.resetComplete = false;

        $scope.archiveReport = function(reportId) {
            var currentPageTemplate = $route.current.templateUrl;
                    $templateCache.remove(currentPageTemplate);
                    $route.reload();
        };
        
        $scope.destroyReport = function(reportId) {
            var req = {
                method: 'POST',
                url: '/destroyReport',
                data: {
                    query: reportId
                }
            };
            
            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
            $http(req).
                success(function(response) {
                    $window.location.reload();
                }).
                error(function(response) {
                });
        };

        $scope.deleteReportsOlderThanXDays = function(days) {
            if (days !== 'undefined' && typeof days !== 'undefined') {
                var req = {
                    method: 'POST',
                    url: '/deleteReportsOlderThanXDays',
                    data: {
                        query: days
                    }
                };
                
                $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

                $http(req).
                    success(function(res) {
                        $scope.deletedReports = res;
                    }).
                    error(function(res) {
                        console.log(res);
                    });
            }
        };

        $scope.resetDatabase = function() {
            var req = {
                    method: 'POST',
                    url: '/resetDatabase',
                };
                
                $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

                $http(req).
                    success(function(res) {
                        $scope.resetComplete = true;
                    }).
                    error(function(res) {
                        $scope.resetComplete = false;
                    });
        };

    }]);