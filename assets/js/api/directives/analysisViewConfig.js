angular.module('ExtentX').
    directive('analysisViewConfig', ['$rootScope', function($rootScope) {
        return {
            restrict: 'A',
            template: '<div></div>',
            link: function($scope, element, attrs) {
                $scope.setNodesPanelHeight = function() {
                    setTimeout(function() {
                        //var rect = document.getElementById("report-list-summary").getBoundingClientRect();
                        //angular.element("#notes").css("height", rect.bottom - 75);
                    }, 50);
                };
            }
        }
    }]);