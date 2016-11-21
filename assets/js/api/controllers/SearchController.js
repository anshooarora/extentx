angular.module("ExtentX")
    .controller("SearchController", ["$scope", "$rootScope", "$http", "$window", '$uibModal', '$timeout', '$location',
    function($scope, $rootScope, $http, $window, $uibModal, $timeout, $location) {
        $scope.page = 1;
        $scope.dateFormat = 'MM-dd-yyyy';
        $scope.startDatePicker = { opened: false };
        $scope.endDatePicker = { opened: false };
        $scope.openStartDate = function() {
            $scope.startDatePicker.opened = true;
        };
        $scope.openEndDate = function() {
            $scope.endDatePicker.opened = true;
        };

        $scope.getTimeDifference = function(to, from) {
            return DateTime.subtract(to, from);
        };
        
        $scope.query = {
            regex: 'contains',
        };

        $scope.searchTests = function(query, page) {
            if (page === 0) {
                $scope.page = 1;
                return;
            }

            $scope.page = page;

            var req = {
                method: 'POST',
                url: '/searchTests',
                data: {
                    query: query,
                    page: page
                }
            };
            
            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;
            
            $http(req).
                success(function(res) {
                    $scope.tests = res;
                });
        };

        /* if coming from another view with the search url, perform search dynamically
         * example of such a URL:
         *   http://localhost:1337/#/search?regex=exact&name=testName
         */
        var obj = $location.search();
        if (Object.keys(obj).length !== 0 && JSON.stringify(obj) !== JSON.stringify({}))
            $scope.search(obj);
    }]);