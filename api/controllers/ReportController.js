/**
 * ReportController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var ObjectId = require('mongodb').ObjectID,
    _ = require("lodash");

module.exports = {
	
    getReportAndTestsCounts: function(req, res) {
        var project = { $ne: null };
        if (typeof req.session.project !== 'undefined' && req.session.project != null) 
            project = req.session.project;

        var d = new Date();
        d.setHours(0,0,0,0);

        Project.find({ name: project })
        .then(function(projects) {
            if (projects.length && projects.length === 1)
                project = projects[0].id;

            var reportLength = Report.count({ project: project })
            .then(function(reportLength) {
                return reportLength;
            });

            var reportTodayLength =  Report.count({ project: project, startTime: { ">=": d}} )
            .then(function(reportTodayLength) {
                return reportTodayLength;
            });
            
            var featureLength = Test.count({ project: project, level: 0 })
            .then(function(featureLength) {
                return featureLength;
            });

            var featurePassLength = Test.count({ project: project, level: 0, status: 'pass' })
            .then(function(featurePassLength) {
                return featurePassLength;
            });

            var featureFailLength = Test.count({ project: project, level: 0, status: { '!': ['pass', 'info'] } })
            .then(function(featureFailLength) {
                return featureFailLength;
            });

            var featureTodayLength = Test.count({ project: project, startTime: { ">=": d}, level: 0 })
            .then(function(featureTodayLength) {
                return featureTodayLength;
            })

            var scenarioLength = Test.count({ project: project, level: 1 })
            .then(function(scenarioLength) {
                return scenarioLength;
            });

            var scenarioPassLength = Test.count({ project: project, level: 1, status: 'pass' })
            .then(function(scenarioPassLength) {
                return scenarioPassLength;
            });

            var scenarioFailLength = Test.count({ project: project, level: 1, status: { '!': ['pass', 'info'] } })
            .then(function(scenarioFailLength) {
                return scenarioFailLength;
            });

            var scenarioTodayLength = Test.count({ project: project, startTime: { ">=": d}, level: 1 })
            .then(function(scenarioTodayLength) {
                return scenarioTodayLength;
            })

            return [ 
                reportLength, 
                reportTodayLength, 
                featureLength,
                featurePassLength,
                featureFailLength,
                featureTodayLength, 
                scenarioLength, 
                scenarioPassLength,
                scenarioFailLength,
                scenarioTodayLength 
            ];
        })
        .spread(function(reportLength, reportTodayLength, featureLength, featurePassLength, featureFailLength, featureTodayLength, scenarioLength, scenarioPassLength, scenarioFailLength, scenarioTodayLength) {
            res.json({
                reportLength: reportLength,
                reportTodayLength: reportTodayLength,
                featureLength: featureLength,
                featurePassLength: featurePassLength,
                featureFailLength: featureFailLength,
                featureTodayLength: featureTodayLength,
                scenarioLength: scenarioLength,
                scenarioPassLength: scenarioPassLength,
                scenarioFailLength: scenarioFailLength,
                scenarioTodayLength: scenarioTodayLength
            });
        })
        .fail(function(err) {
            console.log(err);
            res.json(data);
        });
    },

    getReportById: function(req, res) {
        var id = req.body.query.id;

        Report.findOne({ id: id }).populateAll().exec(function(err, report) {
            res.json(report);
        });
    },

    getReportList: function(req, res) {
        var page = 1;
        if (typeof req.body !== 'undefined' && typeof req.body.query.page !== 'undefined')
            page = req.body.query.page;

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

        var out = {};
        function sendRes() {
            res.json(out);
        }

        Project.find({ name: project }).exec(function(err, projects) {
            if (projects.length && projects.length === 1)
                project = projects[0].id;
            
            Report.find({ project: project }).sort({ startTime: 'desc' }).paginate({ page: page, limit: 10 }).populate('project').exec(function(err, reports) {
                var dataPointSetting = {
                    trendDataPointLength: trendDataPoints,
                    trendDataPointFormat: trendDataPointFormat
                };
                out.dataPointSetting = dataPointSetting;
                out.reports = reports;
                sendRes();
            });
        });
    },

    destroyReportAndDepsByReportId: function(req, res) {
        var reportId = req.body.query.id;

        Report.findOne({ id: reportId })
        .then(function(report) {
            Report.find({ project: report.project }).exec(function(err, reports) {
                if (reports.length === 1) {
                    Project.destroy({ id: reports[0].project }).exec(function(err) {});
                }
            });
        })
        .then(function() {
            Report.destroy({ id: reportId }).exec(function(err) {});
            Author.destroy({ report: reportId }).exec(function(err) {});
            Category.destroy({ report: reportId }).exec(function(err) {});
            Log.destroy({ report: reportId }).exec(function(err) {});
            Test.destroy({ report: reportId }).exec(function(err) {});
            Media.destroy({ report: reportId }).exec(function(err) {});
        })
        .catch(function(err) {
            console.log(err);
        });

        res.send(200);
    },

};

