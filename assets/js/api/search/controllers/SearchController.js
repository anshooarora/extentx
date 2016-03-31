angular.module('ExtentX').
    controller('SearchController', ['$scope', '$sce', '$http', '$location', '$timeout', 'Icon', 'DateTime', 
    function($scope, $sce, $http, $location, $timeout, Icon, DateTime) {
        $scope.trust = $sce.trustAsHtml;
        $scope.testContentDisplayClass = '';
        $scope.showHistory = false;
        
        /* datepicker */
        $scope.dateFormat = 'MM/dd/yyyy';
        $scope.startDatePicker = { opened: false };
        $scope.endDatePicker = { opened: false };
        $scope.openStartDate = function() {
            $scope.startDatePicker.opened = true;
        };
        $scope.openEndDate = function() {
            $scope.endDatePicker.opened = true;
        };

        $scope.getIcon = function(status) {
            return Icon.getIcon(status);
        };
        
        $scope.getTimeDifference = function(to, from) {
            return DateTime.subtract(to, from);
        };
        
        $scope.query = {
            regex: 'contains',
        };
        
        /* pagination */
        $scope.currentPage = 0;
        $scope.pageSize = 20;
        $scope.getNumberOfPages = function(len) {
            if (typeof len === 'undefined' || len === 0) return 0;
            return Math.ceil(len / $scope.pageSize);
        }

        $scope.search = function(query) {
            var req = {
                method: 'POST',
                url: '/search',
                data: {
                    query: query
                }
            };
            
            $http(req).
                success(function(response) {
                    $scope.response = response;
                    console.log(response);
                }).
                error(function(response) {
                    console.log(response);
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
