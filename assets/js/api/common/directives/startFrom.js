angular.module('ExtentX').filter('startFrom', function() {
    return function(input, start) {
        if (typeof input === 'undefined') return 1;
        
        start = +start;
        return input.slice(start);
    }
});