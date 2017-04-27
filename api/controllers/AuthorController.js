/**
 * AuthorController
 *
 * @description :: Server-side logic for managing authors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var ObjectId = require('mongodb').ObjectID,
    _ = require('lodash');

module.exports = {
	
    getAuthorListByReportId: function(req, res) {
        var reportId = req.body.query.id;

        Report.findOne({ id: reportId }).populate('categories').exec(function(err, authorList) {
           if (err) res.json(null);
           else res.json(authorList);
        })
    },

    getTestsByAuthorId: function(req, res) {
        var catId = req.body.query.id;

        Author.findOne({ id: catId }).populate('tests').exec(function(err, authorTests) {
            if (err || typeof authorTests.tests === 'undefined') { 
                res.json(null);
            } else {
                var testIds = [];
                _(authorTests.tests).forEach(function(test) {
                    testIds.push(ObjectId(test.id));
                });

                Test.getTests({ id: testIds }, function(tests) {
                    if (err) res.json(null);
                    else res.json(tests);
                });
            }
        });
    },

    getAuthorNamesWithTestCountsByProject: function(req, res) {
        var project = { $ne: null };
        if (typeof req.session.project !== 'undefined' && req.session.project != null) 
            project = req.session.project;

        Project.find({ name: project }).exec(function(err, projects) {
            if (projects.length && projects.length === 1)
                project = ObjectId(projects[0].id);
            
            Author.native(function(err, nativeColl) {
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
                            count: { $sum: 1 },
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

    getAuthorNamesWithFailedTestCountsByProject: function(req, res) {
        var project = { $ne: null };
        if (typeof req.session.project !== 'undefined' && req.session.project != null) 
            project = req.session.project;

        var dic = {},
            cntr = 0;

        Project.find({ name: project }).exec(function(err, projects) {
            if (projects.length && projects.length === 1)
                project = ObjectId(projects[0].id);

            Author.find({ project: project }).populate("tests", { where: { status: { "!": "pass" }, level: 0 }}).exec(function(err, authorTests) {
                for (var ix = 0; ix < authorTests.length; ix++) {
                    var author = authorTests[ix];
                    if (typeof dic[author.name] === "undefined")
                        dic[author.name] = 0;
                        
                    dic[author.name] = dic[author.name] + author.tests.length;

                    if (++cntr == authorTests.length)
                        res.json(dic);
                }
            });
        });
    },

};

