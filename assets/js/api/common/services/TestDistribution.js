angular.module('ExtentX').
    factory('TestDistribution', function() {
        return {
            getTestDistribution: function(testDistribution) {
                var passed = 0, failed = 0, others = 0;
                var dist = { passed: passed, failed: failed, others: others };

                testDistribution.distribution.forEach(function(item) {
                    if (item._id === 'pass') { dist.passed += item.count; }
                    else if (item._id === 'fail' || item._id === 'fatal' ) { dist.failed += item.count; }
                    else if (item._id === 'skip' || item._id === 'warning' || item._id === 'error') { dist.others += item.count; }
                });

                return dist;
            }
        }
    });