/**
* Category.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var ObjectId = require('mongodb').ObjectID,
    _ = require("lodash");
    
module.exports = {

  attributes: {
      /* tests (many) <-> categories (many)
       * tests and categories have a many to many relationship
       *   - a test can be assigned with one or more categories
       *   - a category can have one or more tests
       *  In Waterline, from the Category model, to find tests:
       *   Category.find().populate('tests')..
       */
      tests: {
          collection: 'test',
          via: 'categories'
      },
      
      project: {
          model: 'project'
      },
      
      /* Owner
       * A report can have one or more categories
       * There is a one-to-many relationship between report and category
       * In Waterline, from the Report model, it is possible to do:
       *   Report.find().populate('categories').. 
       */
      report: {
          model: 'report'
      },
      
      testName: 'string',

      name: 'string',
      status: 'string'
  },
  
  getDistinctNames: function(cb) {
    Category.native(function(err, collection) {
        collection.distinct('name', function(err, result) {
            if (err) console.log(err);
            else cb(result);
        });
    });
  },
  
  getGroupsWithCounts: function(matcher, groupBy, cb) {
    Category.native(function(err, collection) {
        collection.aggregate(
        [
            { $match: matcher },
            { $group: 
                { 
                    _id: groupBy,
                    count: { $sum: 1 },
                }, 
            }
        ],
        function(err, result) {
            if (err) console.log(err);
            else cb(result);
        });
    });
  },

  getCategoryNamesWithTestCountsByProject: function(req, filterStatus, cb) {
    var project = { $ne: null };
    if (typeof req.session.project !== 'undefined' && req.session.project != null) 
        project = req.session.project;

    var dic = {},
        cntr = 0;

    Project.find({ name: project }).exec(function(err, projects) {
        if (projects.length && projects.length === 1)
            project = ObjectId(projects[0].id);

        Category.find({ project: project }).populate("tests", { where: { status: { "!": filterStatus }, level: 0 }}).exec(function(err, categoryTests) {
            if (typeof categoryTests !== 'undefined' && categoryTests != null) {
                for (var ix = 0; ix < categoryTests.length; ix++) {
                    var category = categoryTests[ix];
                    if (typeof dic[category.name] === "undefined")
                        dic[category.name] = 0;
                        
                    dic[category.name] = dic[category.name] + category.tests.length;

                    if (++cntr == categoryTests.length)
                        cb(dic);
                }
            } else {
                cb ([]);
            }
        });
    });
  },

};

