angular.module('ExtentX').
    controller('TestDetailsController', ['$rootScope', '$scope', '$sce', '$http', '$location', 'Icon', 'DateTime', 
    function($rootScope, $scope, $sce, $http, $location, Icon, DateTime) {
        $scope.trust = $sce.trustAsHtml;
        $scope.showHistory = true;
        $scope.path = '/reportDetails';
        $scope.testContentDisplayClass = 'hidden';
        
        $scope.getIcon = function(status) {
            return Icon.getIcon(status);
        };
        
        $scope.getTimeDifference = function(to, from) {
            return DateTime.subtract(to, from);
        };
        
        $scope.getTest = function(id) {
             var req = {
                method: 'POST',
                url: '/getTestsById',
                data: {
                    query: { id: id }
                }
            };
            
            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
            $http(req).
                success(function(response) {
                    $scope.historicalTest = response;
                });
        };

        if ($location.path() === $scope.path && window.location.href.indexOf('?') > 0 && window.location.href.split('?')[1].indexOf('id=') === 0) {
            var id = window.location.href.split('?')[1].replace('id=', '');
            
            var req = {
                method: 'POST',
                url: '/details',
                data: {
                    query: { id: id }
                }
            };
            
            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
            $http(req).
                success(function(response) {
                    $scope.tests = response;
                });
        }

        $scope.getMediaByNodeId = function(id) {
            var req = {
                method: 'POST',
                url: '/getMediaByNodeId',
                data: {
                    id: id
                }
            };
            
            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
            $http(req).
                success(function(response) {
                    console.log(response);
                    $scope.nodeMedia = response;
                });
        };
    }]);