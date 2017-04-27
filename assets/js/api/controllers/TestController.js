angular.module('ExtentX')
    .controller('TestController', ['$rootScope', '$scope', '$http', '$location', '$sce', 'Icon', 
    function($rootScope, $scope, $http, $location, $sce, Icon) {
        $scope.path = '/test';
        $scope.trust = $sce.trustAsHtml;
        $scope.activeTest = null;
        
        $scope.getIcon = function(status) {
            return Icon.getIcon(status);
        };

        $scope.setActiveTest = function(test) {
            $scope.activeTest = test;
        };

        $scope.$on("$destroy", function(){
            angular.element(".navbar").removeClass("hidden");
        });

        $scope.loadTestById = function(testId, isHistorical) {
            var req = {
                method: 'POST',
                url: '/getTestById',
                data: {
                    query: {
                        id: testId
                    }
                }
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
            $http(req).
                success(function(res) {
                    if (!isHistorical) {
                        $scope.test = res;
                        $scope.historicalTest = null;
                        $scope.historicalTestList = null;
                    }
                    else {
                        $scope.historicalTest = res;
                    }
                });
        };

        $scope.loadNodeById = function(testId, level, historical) {
            var req = {
                method: 'POST',
                url: '/getTestById',
                data: {
                    query: {
                        id: testId
                    }
                }
            };
            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
            $http(req).
                success(function(res) {
                    if (level === 1)
                        if (historical)
                            $scope.node3 = res;    
                        else
                            $scope.node1 = res;
                    if (level === 2)
                        if (historical)
                            $scope.node4 = res;
                        else
                            $scope.node2 = res;
                });
        };

        $scope.getCompleteTestHistory = function() {
            var req = {
                method: 'POST',
                url: '/getTestHistory',
                data: {
                    query: { 
                        id: $scope.test.id,
                        name: $scope.test.name
                    }
                }
            };
            
            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
            $http(req).
                success(function(res) {
                    $scope.historicalTestList = res;
                });
        };

        $scope.getMostRecentTestByName = function(name) {
            var req = {
                method: 'POST',
                url: '/getMostRecentTestByName',
                data: {
                    query: { 
                        name: name
                    }
                }
            };
            
            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
            $http(req).
                success(function(res) {
                    $scope.test = res;
                });
        };

        $scope.loadHistoryById = function(testId) {
            $scope.loadTestById(testId, true);
        };

        if ($location.path() === $scope.path && window.location.href.indexOf('?') > 0) {
            if (window.location.href.split('?')[1].indexOf('id=') === 0) {
                var id = window.location.href.split('?')[1].replace('id=', '');
                $scope.loadTestById(id);
            }

            if (window.location.href.split('?')[1].indexOf('name=') === 0) {
                var name = window.location.href.split('?')[1].replace('name=', '');
                $scope.getMostRecentTestByName(name);
            }
        }
    }]);