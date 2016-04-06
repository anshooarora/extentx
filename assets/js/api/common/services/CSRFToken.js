angular.module('ExtentX').
    run(['$http', '$rootScope', function($http, $rootScope) {
        $http.get('/csrfToken').
            success(function(res) {
                $rootScope._csrf = res._csrf;
            }).
            error(function(res) {
                console.log(res);
            });
    }]);