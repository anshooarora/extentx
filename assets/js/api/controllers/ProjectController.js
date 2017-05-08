angular.module('ExtentX')
    .controller('ProjectController', ['$rootScope', '$scope', '$http', '$location', 'Icon', 'ChartSettings', 'PieChartSettings', 
    function($rootScope, $scope, $http, $location, Icon, ChartSettings, PieChartSettings) {
        $scope.projectAndDepsCleared = false;

        $scope.destroyProjectWithDepsByProjectId = function(projectId) {
            console.log(projectId)
            var req = {
                    method: 'POST',
                    url: '/destroyProjectWithDepsByProjectId',
                    data: {
                        query: { 
                            id: projectId
                        }
                    }
                };

                $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
                $http(req).
                    success(function(res) { $scope.projectAndDepsCleared = true; });
        };

        $scope.getProjectsWithDeps = function() {
            var req = {
                method: "GET",
                url: "/getProjectsWithDeps"
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    $scope.projectsAndDeps = res;
                }).
                error(function(err) {
                    console.log(err);
                });
        };

        $scope.loadProjects = function() {
            var req = {
                method: 'GET',
                url: '/getProjects'
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    $scope.projects = res;
                }).
                error(function(err) {
                    console.log(err);
                });
        };

        $scope.switchProject = function(name) {
            console.log(name)
            var req = {
                method: 'POST',
                url: '/switchProject',
                data: {
                    query: {
                        name: name
                    }
                }
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(res) {
                    window.location.reload();
                }).
                error(function(err) {
                    console.log(err);
                });
        };
    }]);