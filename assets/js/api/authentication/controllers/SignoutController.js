angular.module('ExtentX').
    controller('SignoutController', ['$rootScope', '$scope', '$http', '$window', function($rootScope, $scope, $http, $window) {        
        $scope.logout = function() { 
            $http({
                method: 'GET',
                url: '/logout'
            }).then(function(response) { 
                $rootScope.loggedIn = false; 
                $rootScope.loggedInUserName = null;
                
                $window.location.reload();
            });
        };
    }]);
