angular.module('ExtentX').
    factory('RouteQuery', ['$http', '$q', function($http, $q) {
        return {
            get: function(route) {
                var data = {};
                var defer = $q.defer();
                var service = {};

                $http.get(route).
                    success(function(response) {
                        defer.resolve(response);
                    }).
                    error(function(response) {
                        defer.reject(response);
                    });
                
                return defer.promise;
            },
            
            post: function(req) {
                $http(req).
                    success(function(response) {
                        return response;
                    }).
                    error(function(response) {
                        return null;
                    });
            }
        }
    }]);