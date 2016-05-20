/**
 * ReportController
 *
 * @description :: Server-side logic for managing Report details
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var ObjectId = require('mongodb').ObjectID;

module.exports = {
    archive: function(req, res) {
        var reportId = req.body.query;
        
        // move all models to their archive
        
        res.send(200);
    },
    
    destroy: function(req, res) {
        var reportId = req.body.query;

        Report.destroy({ id: reportId }).exec(function(err) {});
        Author.destroy({ report: reportId }).exec(function(err) {});
        Category.destroy({ report: reportId }).exec(function(err) {});
        Log.destroy({ report: reportId }).exec(function(err) {});
        Node.destroy({ report: reportId }).exec(function(err) {});
        Test.destroy({ report: reportId }).exec(function(err) {});
        
        res.send(200);
    },
       
    aggregates: function(req, res) {
        var project = { $ne: null };
        if (typeof req.session.project !== 'undefined' && req.session.project != null) 
            project = req.session.project;

        Project.find({ name: project }).exec(function(err, projects) {
            if (projects.length && projects.length === 1) project = projects[0].id;
            
            Report.find({ project: project }).sort({ startTime: 'desc' }).exec(function(err, result) {
                if (err) console.log(err);

                var testsCount = 0, testsPassed = 0, testsFailed = 0, stepsCount = 0, stepsPassed = 0, stepsFailed = 0;
                var testDistribution = [], logDistribution = [];
                var categories = [];
                var topPassed = [], topFailed = [];
                
                var projects = null;

                var view = function view() {
                    res.json({
                        projects: projects,
                        reports: result,
                        categories: categories,
                        testDistribution: testDistribution,
                        logDistribution: logDistribution,
                        token: {
                            csrf: req.session.csrfSecret
                        },
                        total: {
                            testsCount: testsCount,
                            testsPassed: testsPassed,
                            testsFailed: testsFailed,
                            stepsCount: stepsCount,
                            stepsPassed: stepsPassed,
                            stepsFailed: stepsFailed
                        },
                        trends: {
                            topPassed: topPassed,
                            topFailed: topFailed
                        }
                    });
                }

                if (result.length == 0)
                    view();

                // list all projects
                Project.getProjects(function(p) { projects = p });
                
                // list all categories
                Category.getNames(function(cats) { categories = cats; })
                
                // top passed tests
                Test.getGroupsWithCounts({ status: { $in: ['pass'] }}, { status: '$status', name: '$name' }, { count: -1 }, 10, function(e) {
                    topPassed = e;
                    
                    // top failed tests
                    Test.getGroupsWithCounts({ status: { $in: ['fail', 'fatal'] }}, { status: '$status', name: '$name' }, { count: -1 }, 10, function(e) {
                        topFailed = e;
                    });
                });

                // tests count
                Test.getGroupsWithCounts(
                    { status: { $in: ['pass', 'fail', 'fatal', 'error', 'warning', 'skip'] }, childNodesCount: 0 }, // matcher
                    { status: '$status' }, // groupBy
                    { count: -1 }, // sort
                    10, // limit
                    function(testsByStatus) {
                        testsByStatus.forEach(function(item) {
                            testsCount += item.count;

                            (item._id.status === 'pass') && (testsPassed += item.count);
                            (item._id.status === 'fail' || item._id.status === 'fatal') && (testsFailed += item.count);
                        });
                });

                // nodes count
                Node.getGroupsWithCounts(
                    { status: { $in: ['pass', 'fail', 'fatal', 'error', 'warning', 'skip'] } }, // matcher
                    { status: '$status' }, // groupBy
                    { count: -1 }, // sort
                    10, // limit
                    function(nodesByStatus) {
                        nodesByStatus.forEach(function(item) {
                            testsCount += item.count;

                            (item._id.status === 'pass') && (testsPassed += item.count);
                            (item._id.status === 'fail' || item._id.status === 'fatal') && (testsFailed += item.count);
                        });
                });

                // steps count
                Log.getGroupsWithCounts(
                    { status: { $in: ['pass', 'fail', 'fatal', 'error', 'warning', 'skip', 'info', 'unknown'] } }, // matcher
                    { status: '$status' }, // groupBy
                    function(stepsByStatus) {
                        stepsByStatus.forEach(function(item) {
                            stepsCount += item.count;

                            (item._id.status === 'pass') && (stepsPassed = item.count);
                            (item._id.status === 'fail' || item._id.status === 'fatal') && (stepsFailed += item.count);
                        });
                });

                var itemsToIterate = result.length;

                for (var ix = 0; ix < result.length; ix++) {                    
                    Report.getDistribution(result[ix].id, function(dist) {
                        testDistribution.push(dist.testDistribution);
                        logDistribution.push(dist.logDistribution);

                        if (--itemsToIterate === 0)
                            setTimeout(function() { view(); }, 50);
                    });

                }
            });
        });
    },

    details: function(req, res) {
        req.query = req.body.query;
        
        Test.find({ report: req.query.id }).populateAll().exec(function(err, result) {
            if (err) console.log(err);

            var out = [];
            
            var sendRes = function() {
                res.json(out);
            };

            var getNodesWithLogs = function(nodeArray, cb) {
                if (nodeArray.length === 0) cb(nodeArray);

                var itemsToIterateIn = nodeArray.length;
                
                for (var ix = 0; ix < nodeArray.length; ix++) {
                    (function(ix) {
                        Log.getLogs({ test: nodeArray[ix].id }, function(logs) {
                            nodeArray[ix].logs = logs;
                            
                            if (--itemsToIterateIn === 0) cb(nodeArray);
                        });
                    })(ix);
                }
            }
            
            var itemsToIterate = result.length;
            
            for (var ix = 0; ix < result.length; ix++) {
                (function(ix) {
                    out[ix] = result[ix].toJSON();
                    
                    if (result[ix].nodes.length > 0) {
                        getNodesWithLogs(result[ix].toJSON().nodes, function(nodes) {
                            out[ix].nodes = nodes;
                            
                            (--itemsToIterate === 0) && sendRes();
                        });
                    }
                    else {
                        (--itemsToIterate === 0) && sendRes();
                    }
                })(ix)
            }
        })
    }
};

