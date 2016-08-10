angular.module('ExtentX').
    controller('UserController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        $scope.padded = $rootScope.sideNavToggled ? 'padded': '';

        $scope.isLoggedIn = function() {
            $rootScope.loggedIn = false;
            $rootScope.loggedInUserName = null;
            
            setTimeout(function() { 
                $http({
                    method: 'GET',
                    url: '/isLoggedIn'
                }).
                success(function(response) {
                    if (response && response.user) {
                        $rootScope.loggedIn = true;
                        $rootScope.loggedInUserName = response.user.name;
                        $rootScope.isAdmin = response.user.admin;
                    }
                }).
                error(function(response) {
                    console.log(response);
                });
            }, 100);
        };
    }]);
