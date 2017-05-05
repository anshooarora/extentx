angular.module('ExtentX').
    controller('DataPointsController', ['$rootScope', '$scope', '$uibModal', '$sce', '$http', '$location', '$timeout', 'Icon', 
    function($rootScope, $scope, $uibModal, $sce, $http, $location, $timeout, Icon) {

        $scope.updateDataPointSetting = function(query) {
            var req = {
                method: 'POST',
                url: '/updateDataPointSetting',
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
                    if (typeof response !== 'undefined' && response != null)
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