angular.module("ExtentX")
    .controller("NavigationController", ["$scope", "$rootScope", "$http", "$window", function($scope, $rootScope, $http, $window) {
        $scope.states = {};
        $scope.states.activeItem = 'item1';
        
        $scope.items = [{
            id: "item1",
            target: "#/",
            title: "Analysis",
            icon: "dashboard"
        }, {
            id: "item2",
            target: "#/report-list",
            title: "Reports",
            icon: "folder_open"
        }, {
            id: "item3",
            target: "#/category-summary",
            title: "Category",
            icon: "local_offer"
        }, {
            id: "item4",
            target: "#/author-summary",
            title: "Author",
            icon: "person"
        }, {
            id: "item5",
            target: "#/exception-summary",
            title: "Exception",
            icon: "bug_report"
        }, {
            id: "item6",
            target: "#/search",
            title: "Search",
            icon: "search"
        }];

        $scope.setTheme = function(theme) {
            var req = {
                method: 'POST',
                url: '/setTheme',
                data: {
                    theme: theme
                }
            };

            $http.defaults.headers.post['X-CSRF-Token'] = $rootScope._csrf;

            $http(req).
                success(function(response) {
                    $window.location.reload();
                }).
                error(function(response) {
                    console.log(response);
                });
        };

    }]);