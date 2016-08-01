angular.module('ExtentX').
    controller('AdminController', ['$scope', '$rootScope', '$http', '$window', function($scope, $rootScope, $http, $window) {
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
                    console.log('report destroyed');
                    $window.location.reload();
                }).
                error(function(response) {
                    console.log('report not destroyed');
                });
        };

        $scope.deleteOlderThanXDays = function(days) {
            if (days !== 'undefined' && typeof days !== 'undefined') {
                var req = {
                    method: 'POST',
                    url: '/deleteOlderThanXDays',
                    data: {
                        query: days
                    }
                };
                
                $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

                $http(req).
                    success(function(response) {
                        $window.location.reload();
                    }).
                    error(function(response) {
                        console.log(response);
                    });
            }
        }
    }]);
