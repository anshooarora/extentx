/**
 * ExceptionController
 *
 * @description :: Server-side logic for managing Exceptions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var ObjectId = require('mongodb').ObjectID;

module.exports = {

    getExceptionNamesWithTestCountsByProject: function(req, res) {
        var project = { $ne: null };
        if (typeof req.session.project !== 'undefined' && req.session.project != null) 
            project = req.session.project;
        
        Project.find({ name: project }).exec(function(err, projects) {
            if (projects.length && projects.length === 1)
                project = ObjectId(projects[0].id);
            
            Exception.native(function(err, nativeColl) {
                nativeColl.aggregate(
                [
                    { 
                        $match: { 
                            $and: [
                                { project: project }
                            ]
                        }  
                    },
                    { $group: 
                        { 
                            _id: { name: "$name" },
                            count: { $sum: "$testCount" },
                        }, 
                    },
                    { $sort : { count: -1 } }
                ],
                function(err, result) {
                    if (err) console.log(err);
                    res.json(result);
                });
            });
        });
    },

    getExceptionDistributionByReportByProject: function(req, res) {
        var project = { $ne: null };
        if (typeof req.session.project !== 'undefined' && req.session.project != null) 
            project = req.session.project;
        
        function sendRes(data) {
            res.json(data);
        }

        Project.find({ name: project }).exec(function(err, projects) {
            if (projects.length && projects.length === 1)
                project = ObjectId(projects[0].id);

            Report.find({ project: project }).sort({ startTime: 'desc' }).limit(10).populate("exceptions").exec(function(err, reportList) {
                if (err) console.log(err);

                var data = [];

                for (var ix = 0; ix < reportList.length; ix++) {
                    var report = reportList[ix];

                    var exceptionCount = 0;
                    for (var iy = 0; iy < report.exceptions.length; iy++) {
                        var exception = report.exceptions[iy];
                        exceptionCount += exception.testCount;
                    }

                    data.push({
                        name: report.name,
                        exceptionCount: exceptionCount
                    });

                    var done = reportList.length-1 == ix;
                    (done) && (sendRes(data));
                }
            })
        });
    },

    getExceptionsByReportId: function(req, res) {
        var reportId = req.body.query.reportId;

        Report.findOne({ id: reportId }).populate("exceptions").exec(function(err, exceptions) {
            res.json(exceptions);
        })
    },

    getTestsByExceptionId: function(req, res) {
        var id = req.body.query.id;

        Exception.findOne({ id: id }).populate("tests").exec(function(err, excceptionTests) {
            res.json(excceptionTests);
        });
    },

};

