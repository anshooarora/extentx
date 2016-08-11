angular.module('ExtentX').
    controller('NodeController', ['$rootScope', '$scope', '$http', 
    function($rootScope, $scope, $http) {
        $scope.getChildren = function(id) {
            var req = {
                method: 'POST',
                url: '/getChildNodesByParentId',
                data: {
                    id: id
                }
            };
            
            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
            $http(req).
                success(function(response) {
                    $scope.children = response;
                });
        };
    }]);