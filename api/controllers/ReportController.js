/**
 * ReportController
 *
 * @description :: Server-side logic for managing Report details
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	reports: function(req, res) {
        var page = typeof req.query.page === 'undefined' || req.query.page === '' ? 1 : (parseInt(req.query.page));
        var limit = 10;
        
        Report.count().exec(function(err, count) {
            if (err) console.log('ReportController.reports -> ' + err);
            
            Report.find({ }).sort({startTime: 'desc'}).paginate({ page: page, limit: limit }).exec(function(err, result) {
                var pages = (count / limit);
                if ((count / limit).toString().indexOf('.') > 0) {
                    pages = parseInt((count / limit).toString().split('.')[0]) + 1;
                }
                
                if (err) console.log(err);
                
                var itemCounts = {
                    pagesCount: pages,
                    reportsCount: count,
                    testsCount: 0,
                    testsPassed: 0,
                    testsFailed: 0,
                    stepsCount: 0,
                    stepsPassed: 0,
                    stepsFailed: 0
                }
                
                var view = function view() {
                    res.view('reportSummary', { 
                        fields: result, 
                        statusDistribution: statusDistribution,
                        currentPage: page,
                        limit: limit,
                        itemCounts: itemCounts
                    });
                }
                
                if (result.length == 0)
                    view();
                
                var statusDistribution = {
                    testDistribution: [],
                    logDistribution: []
                };
                
                // tests count
                Test.getGroupsWithCounts(
                  { status: { $in: ['pass', 'fail', 'fatal', 'error', 'warning', 'skip'] }, childNodesCount: 0 }, // matcher
                  { status: '$status'}, // groupBy
                  { count: -1 }, // sort
                  10, // limit
                  function(testsByStatus) {    
                    testsByStatus.forEach(function(item) {
                        itemCounts.testsCount += item.count;
                        
                        (item._id.status === 'pass') && (itemCounts.testsPassed += item.count);
                        (item._id.status === 'fail' || item._id.status === 'fatal') && (itemCounts.testsFailed += item.count);
                    });
                });
                
                // nodes count
                Node.getGroupsWithCounts(
                  { status: { $in: ['pass', 'fail', 'fatal', 'error', 'warning', 'skip'] } }, // matcher
                  { status: '$status'}, // groupBy
                  { count: -1 }, // sort
                  10, // limit
                  function(nodesByStatus) {    
                    nodesByStatus.forEach(function(item) {
                        itemCounts.testsCount += item.count;
                        
                        (item._id.status === 'pass') && (itemCounts.testsPassed += item.count);
                        (item._id.status === 'fail' || item._id.status === 'fatal') && (itemCounts.testsFailed += item.count);
                    });
                });
                
                // steps count
                Log.getGroupsWithCounts(
                  { status: { $in: ['pass', 'fail', 'fatal', 'error', 'warning', 'skip', 'info', 'unknown'] }}, // matcher
                  { status: '$status'}, // groupBy
                  function(stepsByStatus) {
                    stepsByStatus.forEach(function(item) {
                        itemCounts.stepsCount += item.count;
                        
                        (item._id.status === 'pass') && (itemCounts.stepsPassed = item.count);
                        (item._id.status === 'fail' || item._id.status === 'fatal') && (itemCounts.stepsFailed += item.count);
                    });
                });
                
                var itemsToIterate = result.length;
                
                for (var ix = 0; ix < result.length; ix++) {
                    
                    Report.getDistribution(result[ix].id, function(dist) {
                        statusDistribution.testDistribution.push(dist.testDistribution);
                        statusDistribution.logDistribution.push(dist.logDistribution);

                        if (--itemsToIterate === 0)
                            view();
                    });
                    
                }
            });
        });
    },
    
    showLastRunReport: function(req, res) {
        Report.find({ }).sort({startTime: 'desc'}).limit(1).exec(function(err, report) {
            if (report.length > 0) {
                res.redirect('/reportDetails?id=' + report[0].id);
            }
            else {
                res.view('details', { tests: null, history: null });
            }
        });
    },
    
    details: function(req, res) {
        Test.find({ 
            owner: req.query.id
        }).populateAll().exec(function(err, result) {
            if (err) {
                console.log(err);
            }
            
            var itemsToIterate = result.length;            
            var history = [];
            
            for (var ix = 0; ix < result.length; ix++) {
                Test.getChildren({ name: result[ix].name }, function(tests) {
                    
                    history.push(tests);
                    
                    if (--itemsToIterate == 0)
                        res.view('details', { tests: result, history: history });
                        
                });                
            }
        });
    },
    
    reportDistribution: function(req, res) {
        var limit = typeof req.query.limit === 'undefined' ? 10 : parseInt(req.query.limit);
        
        Report.find({ }).sort({startTime: 'desc'}).limit(limit).exec(function(err, result) {
            var itemsToIterate = result.length;
            
            var distribution = {
                testDistribution: [],
                logDistribution: []
            };
            
            for (var ix = 0; ix < result.length; ix++) {
                
                ReportService.getReportDistributionWithTimeStamp(result[ix].id, function(dist) {
                    distribution.testDistribution.push(dist.testDistribution);
                    distribution.logDistribution.push(dist.logDistribution);
                    
                    if (--itemsToIterate === 0)
                        res.json(200, distribution);
                });
                
            }
        });
    }
};

