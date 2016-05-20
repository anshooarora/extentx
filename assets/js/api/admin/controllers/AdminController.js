angular.module('ExtentX').
    controller('AdminController', ['$scope', '$rootScope', '$http', '$window', function($scope, $rootScope, $http, $window) {
        $scope.archiveReport = function(reportId) {
            console.log(reportId);
            var currentPageTemplate = $route.current.templateUrl;
                    $templateCache.remove(currentPageTemplate);
                    $route.reload();
                    console.log(currentPageTemplate);
        };
        
        $scope.destroyReport = function(reportId) {
            console.log(reportId);
            
            var req = {
                method: 'POST',
                url: '/destroy',
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
    }]);
