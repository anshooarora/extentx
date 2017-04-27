angular.module('ExtentX', ['ngRoute', 'ngCookies', 'chart.js', 'ui.bootstrap', 'ngAnimate']).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/', { templateUrl: 'partials/analysis.html' }).
            when('/report-list', { templateUrl: 'partials/report-list.html' }).
            when('/projects-overview', { templateUrl: 'partials/projects-overview.html' }).
            when('/report-summary', { templateUrl: 'partials/report-summary.html' }).
            when('/report', { templateUrl: 'partials/report.html' }).
            when('/test', { templateUrl: 'partials/test.html' }).
            when('/admin', { templateUrl: 'partials/admin.html' }).
            when('/change-password', { templateUrl: 'partials/change-password.html' }).
            when('/author-summary', { templateUrl: 'partials/author-summary.html' }).            
            when('/category-summary', { templateUrl: 'partials/category-summary.html' }).
            when('/categories-by-report', { templateUrl: 'partials/categories-by-report.html' }).
            when('/exception-summary', { templateUrl: 'partials/exception-summary.html' }).
            when('/exceptions-by-report', { templateUrl: 'partials/exceptions-by-report.html' }).
            when('/search', { templateUrl: 'partials/search.html' }).
            otherwise({ redirectTo: '/' });
    }]);
