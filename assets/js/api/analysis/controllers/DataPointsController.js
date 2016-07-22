angular.module('ExtentX').
    controller('DataPointsController', ['$rootScope', '$scope', '$uibModal', '$sce', '$http', '$location', '$timeout', 'Icon', 'DateTime', 
    function($rootScope, $scope, $uibModal, $sce, $http, $location, $timeout, Icon, DateTime) {

        $scope.updateDataPoints = function(query) {
            var req = {
                method: 'POST',
                url: '/dataPointSettings',
                data: {
                    query: query
                }
            };
            
            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
            $http(req).
                success(function(response) { 
                    window.location.reload();
                }).
                error(function(response) {
                    console.log(response);
                });
        };

        $scope.animationsEnabled = true;
        $scope.open = function (size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'dataPointsSetting.html',
                controller: 'ModalInstanceController',
                size: 'sm',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            $rootScope.modal = modalInstance;
        };

    }]);