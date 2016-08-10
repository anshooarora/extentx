angular.module('ExtentX').
    controller('CategoryViewController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        $scope.getCategoriesForReport = function(reportId) {
            var req = {
                method: 'POST',
                url: '/getCategoryListForReport',
                data: {
                    id: reportId
                }
            };
            
            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
            $http(req).
                success(function(response) {
                    $scope.categories = response[0].categories;
                }).
                error(function(response) {
                    $scope.categories = null;
                    console.log(response);
                });
        };

        $scope.getTestsForCategory = function(categoryId) {
            var req = {
                method: 'POST',
                url: '/getTestsForCategory',
                data: {
                    id: categoryId
                }
            };
            
            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
            $http(req).
                success(function(response) {
                    console.log(response);
                    //console.log(response[0].tests);
                    $scope.tests = response;
                }).
                error(function(response) {
                    $scope.tests = null;
                    console.log(response);
                });
        };

        $scope.testContentDisplayClass = '';
    }]);
