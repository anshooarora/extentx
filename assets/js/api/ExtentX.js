angular.module('ExtentX', ['ngRoute', 'ngCookies', 'chart.js', 'ui.bootstrap']).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/', { templateUrl: 'partials/analysis.html' }).
            when('/admin', { templateUrl: 'partials/admin.html' }).
            when('/analysis', { templateUrl: 'partials/analysis.html' }).
            when('/reports', { templateUrl: 'partials/reports.html' }).
            when('/reportDetails', { templateUrl: 'partials/details.html' }).
            when('/settings', { templateUrl: 'partials/settings.html' }).
            when('/search', { templateUrl: 'partials/search.html' }).
            otherwise({ redirectTo: '/' });
    }]);
