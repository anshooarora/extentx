/**
 * AnalysisController
 *
 * @description :: Server-side logic for managing Analysis -> Dashboard view
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
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
            var categories = null;

            var view = function view() {
                res.view('dashboard', { 
                    fields: result, 
                    statusDistribution: statusDistribution,
                    passedStatus: passed,
                    failedStatus: failed,
                    categories: categories
                });
            }
            
            if (itemsToIterate == 0)
                view();

            Test.getGroupsWithCounts({ status: { $in: ['pass'] }}, { status: '$status', name: '$name' }, { count: -1 }, 10, function(e) {
                passed = e;
            });
            
            Test.getGroupsWithCounts({ status: { $in: ['fail', 'fatal'] }}, { status: '$status', name: '$name' }, { count: -1 }, 10, function(e) {
                failed = e;
            });
            
            Category.getNames(function(cats) {
                categories = cats;
            });
            
            for (var ix = 0; ix < result.length; ix++) {
                Report.getDistribution(result[ix].id, function(dist) {
                    statusDistribution.testDistribution.push(dist.testDistribution);
                    statusDistribution.logDistribution.push(dist.logDistribution);

                    if (--itemsToIterate === 0)
                        view();
                });
            }
        });
    }
};