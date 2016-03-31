angular.module('ExtentX').
    factory('LogDistribution', function() {
        return {
            getLogDistribution: function(logDistribution) {
                var passed = 0, failed = 0, others = 0;
                var targetDist = null, dist = { passed: passed, failed: failed, others: others };
                
                logDistribution.distribution.forEach(function(item) {
                    if (item._id === 'pass') { dist.passed += item.count; }
                    else if (item._id === 'fail' || item._id === 'fatal' ) { dist.failed += item.count; }
                    else { dist.others += item.count; }
                });
                
                return dist;
            }
        };
    });