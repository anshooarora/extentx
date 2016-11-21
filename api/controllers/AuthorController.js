/**
 * AuthorController
 *
 * @description :: Server-side logic for managing authors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var ObjectId = require('mongodb').ObjectID,
    _ = require('lodash');

module.exports = {
	
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
    
    getAuthorListByReportId: function(req, res) {
        var reportId = req.body.query.id;

        Report.findOne({ id: reportId }).populate('categories').exec(function(err, authorList) {
           if (err) res.json(null);
           else res.json(authorList);
        })
    },

};

