angular.module('ExtentX').
    controller('ProjectController', ['$rootScope', '$scope', '$http', '$route', 
      function($rootScope, $scope, $http, $route) {
        $scope.update = function(project) {
            var req = {
                method: 'POST',
                url: '/switchProject',
                data: {
                    project: project
                }
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
            $http(req).success(function() { window.location.reload(); });
        };
    }]);