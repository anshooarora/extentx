angular.module("ExtentX")
    .controller("NavigationController", ["$scope", function($scope) {
        $scope.states = {};
        $scope.states.activeItem = 'item1';
        
        $scope.items = [{
            id: "item1",
            target: "#/",
            title: "Analysis",
            icon: "fa-th-large"
        }, {
            id: "item2",
            target: "#/reports",
            title: "Reports",
            icon: "fa-folder-o"
        }, {
            id: "item3",
            target: "#/search",
            title: "Search",
            icon: "fa-search"
        }];
    }]);