/**
 * ReportController
 *
 * @description :: Server-side logic for managing Report details
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var ObjectId = require('mongodb').ObjectID,
    _ = require('lodash');

module.exports = {
    archive: function(req, res) {
        var reportId = req.body.query;
        
        // move all models to their archive
        
        res.send(200);
    },
    
    destroyReportWithDeps: function(req, res) {
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

        // system default data-points
        var trendDataPoints = 5,
            trendDataPointFormat = 'long-dt';
        // override data-points if admin has set this value globally
        Settings.findOne({ name: 'trendDataPoints' }).exec(function(err, result) {
            trendDataPoints = result.value;

            // if user has a local setting, override all others with this
            if (typeof req.session.trendDataPoints !== 'undefined')
                trendDataPoints = req.session.trendDataPoints;
        })
        Settings.findOne({ name: 'trendDataPointFormat' }).exec(function(err, result) {
            trendDataPointFormat = result.value;

            // if user has a local setting, override all others with this
            if (typeof req.session.trendDataPointFormat !== 'undefined')
                trendDataPointFormat = req.session.trendDataPointFormat;
        })

        Project.find({ name: project }).exec(function(err, projects) {
            if (projects.length && projects.length === 1) project = projects[0].id;
            
            Report.find({ project: project }).sort({ startTime: 'desc' }).exec(function(err, result) {
                if (err) console.log(err);

                var categories = [];
                var topPassed = [], topFailed = [];

                var projects = null;

                var view = function() {
                    var out = {
                        projects: projects,
                        reports: result,
                        categories: categories,
                        trendDataPoints: trendDataPoints,
                        trendDataPointFormat: trendDataPointFormat,
                        token: {
                            csrf: req.session.csrfSecret
                        },
                        trends: {
                            topPassed: topPassed,
                            topFailed: topFailed
                        }
                    };
                    
                    res.json(out);
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
                        view();
                    });
                });
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

