angular.module('ExtentX').
    factory('DateTime', function() {
        return {
            subtract: function(to, from) {
                return (new Date(to) - new Date(from));
            },
            
            sortByDate: function(res) {
                var times = [];

                // add times, to be sorted
                for (var ix = 0; ix < res.length; ix++) {
                    times.push(new Date(res[ix].report.startTime));
                }
                
                // sort times   
                times.sort(function (a, b) {
                    return new Date(a) - new Date(b);
                });
                
                // sort distribution by time
                var sortedResponse = [];
                for (t = 0; t < times.length; t++)
                    for (var ix = 0; ix < res.length; ix++)
                        if (new Date(times[t]).getTime() === new Date(res[ix].report.startTime).getTime()) {
                            sortedResponse.unshift(res[ix]);
                            break;
                        }
                
                return sortedResponse;
            }
        };
    });