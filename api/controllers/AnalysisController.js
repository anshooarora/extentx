/**
 * AnalysisController
 *
 * @description :: Server-side logic for managing Analysis -> Dashboard view
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    trends: function(req, res) {
        var passed, failed;
        
        TestService.getTestsSortedByStatus(['pass'], function(e) {
            passed = e;
            
            TestService.getTestsSortedByStatus(['fatal', 'fail'], function(e) {
                failed = e;
                
                res.view('trends', { passed: passed, failed: failed });
            });
        });
    },

    /*
    * dashboard -> reports
    *   show latest report at the top
    *   limit to the top 5 reports
    *       detailed report analysis can be done from the reports view
    */    
    dashboard: function(req, res) {
        Report.find({ }).sort({startTime: 'desc'}).limit(5).exec(function(err, result) {
            if (err) {
                console.log(err);
                return;
            }

            var statusDistribution = {
                testDistribution: [],
                logDistribution: []
            };
            
            var itemsToIterate = result.length;
            var passed = 0, failed = 0;

            var view = function view() {
                res.view('dashboard', { 
                    fields: result, 
                    statusDistribution: statusDistribution,
                    passedStatus: passed,
                    failedStatus: failed
                });
            }
            
            if (itemsToIterate == 0)
                view();

            TestService.getTestsGroupCounts({ status: { $in: ['pass'] }}, { status: '$status', name: '$name' }, { count: -1 }, function(e) {
                passed = e;
                
                TestService.getTestsGroupCounts({ status: { $in: ['fail', 'fatal'] }}, { status: '$status', name: '$name' }, { count: -1 }, function(e) {
                    failed = e;
                    
                    for (var ix = 0; ix < result.length; ix++) {
                        ReportService.getReportDistribution(result[ix].id, function(dist) {
                            statusDistribution.testDistribution.push(dist.testDistribution);
                            statusDistribution.logDistribution.push(dist.logDistribution);
                            
                            if (--itemsToIterate === 0)
                                view();
                        });
                    }
                });
            });
        });
    }
};