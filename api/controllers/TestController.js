/**
 * TestController
 *
 * @description :: Server-side logic for managing Tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var ObjectId = require('mongodb').ObjectID,
    _ = require("lodash");

module.exports = {
	
    /**
     * getTestHistory
     */
    getTestHistory: function(req, res) {
        var id = req.body.query.id,
            name = req.body.query.name;

        Test.getTests({ name: name, id: { $ne: id }}, function(tests) {
            res.json(tests);
        });
    },

    /** 
     * getTestById
    */
    getTestById: function(req, res) {
        var id = req.body.query.id,
            cntr = 0;
        
        Test.findOne({ id: id }).populateAll().exec(function(err, test) {
            if (err) console.log('Test.getTestById -> ' + err);

            Test.find({ parent: id }).populateAll().exec(function(err, nodes) {
                test.nodes = nodes;

                if (nodes.length === 0)
                    res.json(test);

                for (var ix = 0; ix < nodes.length; ix++) {
                    (function(ix) {
                    Test.find({ parent: nodes[ix].id }).populateAll().exec(function(err, grandchildren) {
                        test.nodes[ix].nodes = grandchildren;

                        if (++cntr == nodes.length)
                            res.json(test);
                    })
                    })(ix)
                }
            });
        });
    },

    getMostRecentTestByName: function(req, res) {
        var name = req.body.query.name;

        Test.findOne({ where: {name: name}, sort: 'startTime DESC' }).exec(function(err, test) {
            if (err) console.log(err);
            res.json(test);
        })
    },

    getTopFailedTestsByProject: function(req, res) {
        var project = { $ne: null };
        if (typeof req.session.project !== 'undefined' && req.session.project != null) 
            project = req.session.project;

        Project.find({ name: project }).exec(function(err, projects) {
            if (projects.length && projects.length === 1) project = projects[0].id;

            Report.find({ project: project }).sort({ startTime: 'desc' }).exec(function(err, reportList) {
                var reportIds = [];
                for (var ix = 0; ix < reportList.length; ix++) {
                    reportIds.push(ObjectId(reportList[ix].id));
                    var done = reportList.length-1 == ix;
                    (done) && (sendRes());
                }

                function sendRes() {
                    Test.getGroupsWithCounts([{ status: { $in: ['fail', 'fatal', 'error'] }}, { report: { $in: reportIds}}], { status: '$status', name: '$name' }, { count: -1 }, 10, function(topFailedTests) {
                        res.json(topFailedTests);
                    });
                }
            });
        });
    },
    
};

