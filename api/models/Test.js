/**
* Test.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var ObjectId = require('mongodb').ObjectID;

module.exports = {

  attributes: {
      project: {
          model: 'project'
      },

      /* Owner
       * A report can have one or more tests
       * There is a one-to-many relationship between report and test
       * In Waterline, from the Report model, it is possible to do:
       *   Report.find().populate('tests').. 
       */
      report: {
          model: 'report'
      },

      /* A test can have one or more logs
       * There is a one-to-many relationship between a test and log
       * In Waterline, from the Test model, to find logs:
       *   Test.find().populate('logs')..
       */ 
      logs: {
        collection: 'log',
        via: 'test'
      },

      media: {
          collection: 'media',
          via: 'test'
      },
      
      /* tests (many) <-> categories (many)
       * tests and categories have a many to many relationship
       *   - a test can be assigned with one or more categories
       *   - a category can have one or more tests
       * In Waterline, from the Test model, to find categories:
       *   Test.find().populate('categories')..
       */
      categories: {
          collection: 'category',
          via: 'tests',
      },
      
      /* tests (many) <-> authors (many)
       * tests and authors have a many to many relationship
       *   - a test can be assigned with one or more authors
       *   - a category can have one or more tests
       * In Waterline, from the Test model, to find authors:
       *   Test.find().populate('authors')..
       */
      authors: {
          collection: 'author',
          via: 'tests',
      },

      exception: {
          model: 'exception'
      },

      parent: {
          model: 'test'
      },

      parentName: 'string',
      level: 'integer',

      name: 'text',
      bdd: {
          type: 'boolean',
          defaultsTo: false
      },
      bddType: {
          type: 'string',
          enum: ['feature', 'background', 'scenario', 'given', 'when', 'then', 'and']
      },
      status: {
          type: 'string',
          enum: ['pass', 'fail', 'fatal', 'error', 'warning', 'skip', 'unknown'],
          defaultsTo: 'unknown'
      },
      categorized: {
          type: 'boolean',
          defaultsTo: false
      },
      description: 'text',
      startTime: 'date',
      endTime: 'date',
      duration: 'integer',
      childNodesLength: 'integer'
  },
  
  getTest: function(json, cb) {
        Test.findOne(
            json
        ).populateAll().exec(function(err, result) {
            if (err) console.log('TestService.getTest -> ' + err);
            
            cb(result);
        });
    },
    
    getTests: function(json, cb) {
        Test.find(
            json
        ).sort({"startTime": -1}).populateAll().exec(function(err, result) {
            if (err) console.log('TestService.getTests -> ' + err);
            
            cb(result);
        });
    },

    deepPopulateLogElements: function(test, cb) {
        var cntr = 0;

        if (test.logs == null || test.logs.length === 0)
            cb(test);

        var t = test.toObject();

        for (var ix = 0; ix < t.logs.length; ix++) {
            (function(ix) {
                Log.findOne({ id: t.logs[ix].id }).populateAll().exec(function(err, log) {
                    t.logs[ix] = log;

                    if (++cntr == t.logs.length)
                        cb(t);
                })
            })(ix)
        }
    },

    getGroupsWithCounts: function(matcher, groupBy, sortBy, limit, cb) {
        Test.native(function(err, collection) {
            collection.aggregate(
            [
                { $match: { $and: matcher }},
                { $group: 
                    { 
                        _id: groupBy,
                        count: { $sum: 1 },
                    }, 
                },
                { $sort : sortBy },
                { $limit: limit }
            ],
            function(err, result) {
                if (err) console.log(err);
                else cb(result);
            });
        });
    },
};

