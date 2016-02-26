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
                
                if (err) {
                    console.log(err);
                    return;
                }
                
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
                var itemsToIterate = result.length;
                
                // tests count
                TestService.getTestsGroupCounts({
                    status: {
                        $in: ['pass', 'fail', 'fatal', 'error', 'warning', 'skip']
                    }}, { status: '$status'}, { count: -1 }, function(testsByStatus) {
                        
                    testsByStatus.forEach(function(item) {
                        itemCounts.testsCount += item.count;
                        
                        (item._id.status === 'pass') && (itemCounts.testsPassed = item.count);
                        (item._id.status === 'fail' || item._id.status === 'fatal') && (itemCounts.testsFailed += item.count);
                    });
                });
                
                // steps count
                StepService.getStepsGroupCounts({
                    status: {
                        $in: ['pass', 'fail', 'fatal', 'error', 'warning', 'skip', 'info', 'unknown']
                    }}, { status: '$status'}, function(stepsByStatus) {
                        
                    stepsByStatus.forEach(function(item) {
                        itemCounts.stepsCount += item.count;
                        
                        (item._id.status === 'pass') && (itemCounts.stepsPassed = item.count);
                        (item._id.status === 'fail' || item._id.status === 'fatal') && (itemCounts.stepsFailed += item.count);
                    });
                });
                
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
    },
    
    showLastRunReport: function(req, res) {
        Report.find({ }).sort({startTime: 'desc'}).limit(1).exec(function(err, report) {
            
            Test.find({ 
                owner: report[0].id
            }).populateAll().exec(function(err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                
                var itemsToIterate = result.length;            
                var history = [];
                
                for (var ix = 0; ix < result.length; ix++) {
                    TestService.getLogs({ name: result[ix].name }, function(tests) {
                        
                        history.push(tests);
                        
                        if (--itemsToIterate == 0)
                            res.view('details', { tests: result, history: history });
                            
                    });                
                }
            });
        });
    },
    
    details: function(req, res) {
        Test.find({ 
            owner: req.query.id
        }).populateAll().exec(function(err, result) {
            if (err) {
                console.log(err);
                return;
            }
            
            var itemsToIterate = result.length;            
            var history = [];
            
            for (var ix = 0; ix < result.length; ix++) {
                TestService.getChildren({ name: result[ix].name }, function(tests) {
                    
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
                        res.send(200, distribution);
                });
                
            }
        });
    }
    
    /*reportDistribution: function(req, res) {
        Report.find({ }).sort({startTime: 'desc'}).exec(function(err, result) {
            var itemsToIterate = result.length;
            var distribution = {
                testDistribution: [],
                logDistribution: []
            };
            
            for (var ix = 0; ix < result.length; ix++) {
                
                Report.getTestDistribution(result[ix].id, function(testDist) {
                    Report.getLogDistribution(testDist[0].owner, function(logDist) {
                        ReportService.getReport(testDist[0].owner, function(report) {
                            testDist.push({ reportTime: new Date(report.startTime) });
                            logDist.push({ reportTime: new Date(report.startTime) });
                                                        
                            distribution.testDistribution.push(testDist);
                            distribution.logDistribution.push(logDist);
                            
                            if (--itemsToIterate === 0)
                                res.send(200, distribution);
                        });
                        
                    });
                });
            }
        });
    },*/
};

