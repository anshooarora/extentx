/**
 * CategoryController
 *
 * @description :: Server-side logic for managing Categories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var ObjectId = require('mongodb').ObjectID,
    _ = require('lodash');

module.exports = {
	
    getDistinctCategoryNamesByProject: function(req, res) {
        var project = { $ne: null };
        if (typeof req.session.project !== 'undefined' && req.session.project != null) 
            project = req.session.project;

        Project.find({ name: project }).exec(function(err, projects) {
            if (projects.length && projects.length === 1)
                project = ObjectId(projects[0].id);
                
                Category.native(function(err, collection) {
                    collection.aggregate([
                        { "$match": { "project": project } },
                        { "$group": { "_id": '$name' } }
                    ], function(err, categories) {
                        res.json(categories);
                    });
                });
        });
    },

    getCategoryListByReportId: function(req, res) {
        var reportId = req.body.query.id;

        Report.findOne({ id: reportId }).populate('categories').exec(function(err, categoryList) {
           if (err) res.json(null);
           else res.json(categoryList);
        })
    },

    getTestsByCategoryId: function(req, res) {
        var catId = req.body.query.id;

        Category.findOne({ id: catId }).populate('tests').exec(function(err, categoryTests) {
            if (err || typeof categoryTests.tests === 'undefined') { 
                res.json(null);
            } else {
                var testIds = [];
                _(categoryTests.tests).forEach(function(test) {
                    testIds.push(ObjectId(test.id));
                });

                Test.getTests({ id: testIds }, function(tests) {
                    if (err) res.json(null);
                    else res.json(tests);
                });
            }
        });
    },

    getCategoryNamesWithTestCountsByProject: function(req, res) {
        Category.getCategoryNamesWithTestCountsByProject(req, "", function(categoryTestCounts) {
            res.json(categoryTestCounts);
        })
    },

    getCategoryNamesWithFailedTestCountsByProject: function(req, res) {
        Category.getCategoryNamesWithTestCountsByProject(req, "pass", function(categoryTestCounts) {
            res.json(categoryTestCounts);
        })
    },

};

