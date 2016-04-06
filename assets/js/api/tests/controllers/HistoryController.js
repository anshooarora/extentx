angular.module('ExtentX').
    controller('HistoryController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        $scope.getHistory = function(name, id) {
            var req = {
                method: 'POST',
                url: '/getHistory',
                data: {
                    query: { name: name, id: id }
                }
            };
            
            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
            $http(req).
                success(function(response) {
                    $scope.history = response;
                });
        };
    }]);
