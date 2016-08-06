/**
* Test.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var ObjectId = require('mongodb').ObjectID;

module.exports = {

  attributes: {
      /* Owner
       * A report can have one or more tests
       * There is a one-to-many relationship between report and test
       * In Waterline, from the Report model, it is possible to do:
       *   Report.find().populate('tests').. 
       */
      report: {
          model: 'report'
      },
      
      /* A test can have one or more nodes (child tests)
       * There is a one-to-many relationship between parent-test and node
       * In Waterline, from the Test model, to find nodes:
       *   Test.find().populate('nodes')..
       */ 
      nodes: {
          collection: 'node',
          via: 'test'
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
      warnings: 'text',
      startTime: 'date',
      endTime: 'date',
      childNodesCount: 'string'
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
    
    getLogs: function(json, cb) {
        Test.find(
            json
        ).populate('logs').exec(function(err, result) {
            if (err) console.log('TestService.getLogs -> ' + err);
            
            cb(result);
        });
    },
    
    getChildren: function(json, cb) {
        Test.find(
            json
        ).populateAll().exec(function(err, result) {
            if (err) console.log('TestService.getChildren -> ' + err);
            
            cb(result);
        });
    },
    
    getNodeDistributionByReport: function(id, cb) {
        Node.native(function(err, collection) {
            collection.aggregate(
            [
                { $match: { report: new ObjectId(id) } },
                { $group: 
                    { 
                        _id: '$status', 
                        count: { $sum: 1 }
                    }, 
                }
            ],
            function(err, result) {
                if (err) console.log(err);
                else {
                    Report.getReport(id, function(report) {
                        cb({
                            report: report,
                            distribution: result
                        });
                    });
                }
            });
        });
    },
    
    getGroupsWithCounts: function(matcher, groupBy, sortBy, limit, cb) {
        console.log(matcher);
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

