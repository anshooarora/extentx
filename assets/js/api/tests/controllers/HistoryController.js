angular.module('ExtentX').
    controller('HistoryController', ['$scope', '$http', function($scope,$http) {
        $scope.getHistory = function(name, id) {
            var req = {
                method: 'POST',
                url: '/getHistory',
                data: {
                    query: { name: name, id: id }
                }
            };
            
            $http(req).
                success(function(response) {
                    $scope.history = response;
                });
        };
    }]);
