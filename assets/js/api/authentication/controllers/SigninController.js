angular.module('ExtentX').
    controller('SigninController', ['$rootScope', '$scope', '$http', '$uibModal', '$timeout', 
    function($rootScope, $scope, $http, $uibModal, $timeout) {
        $scope.disabled = false;
        $scope.invalidLogin = false;
        $scope.loginSuccess = false;
        
        $scope.attemptLogin = function(query) {
            var req = {
                method: 'POST',
                url: '/login',
                data: {
                    query: query
                }
            };
            
            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
            $http(req).
                success(function(response) {
                    $rootScope.loggedIn = true;
                    $rootScope.loggedInUserName = response.user.name;
                    $rootScope.isAdmin = response.user.admin;
                    
                    $scope.loginSuccess = true;
                    $scope.invalidLogin = false;
                    $scope.disabled = true;                    
                    $scope.query = null;
                    
                    var closeModal = function() {
                        $rootScope.modal.close();
                    };
                    $timeout(closeModal, 1000);
                }).
                error(function(response) {
                    $scope.invalidLogin = true;
                });
        };
        
        $scope.animationsEnabled = true;
        $scope.open = function (size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'signin.html',
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
