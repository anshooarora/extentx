angular.module('ExtentX').
    factory('Aggregates', ['$http', '$q', 'RouteQuery', function($http, $q, routeQuery) {
        return routeQuery.get('/aggregates');
    }]);