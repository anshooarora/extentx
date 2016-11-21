angular.module('ExtentX').
    factory('ViewNameSetter', ['$rootScope', function($rootScope) {
        return {
            setViewName: function setViewName(viewName) {
                $rootScope.viewName = viewName;
            }
        }
    }]);