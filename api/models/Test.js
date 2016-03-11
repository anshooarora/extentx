/**
* Test.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var ObjectId = require('mongodb').ObjectID;

module.exports = {

  attributes: {
      owner: {
          model: 'report'
      },
      
      nodes: {
          collection: 'node',
          via: 'owner'
      },
      
      logs: {
        collection: 'log',
        via: 'owner'
      },
      
      categories: {
          collection: 'category',
          via: 'owner'
      },
      
      authors: {
          collection: 'author',
          via: 'owner'
      },

      name: 'text',
      status: {
          type: 'string',
          enum: ['pass', 'fail', 'fatal', 'error', 'warning', 'skip', 'unknown'],
          defaultsTo: 'unknown'
      },
      description: 'text',
      warnings: 'text',
      startTime: 'date',
      endTime: 'date',
      childNodesCount: 'number'
  },
  
  getTest: function(id, cb) {
        Test.findOne({
            id: id
        }).exec(function(err, result) {
            if (err) console.log('TestService.getTest -> ' + err);
            
            cb(result);
        });
    },
    
    getTests: function(json, cb) {
        Test.find(
            json
        ).exec(function(err, result) {
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
                }, 
            ],
            function(err, result) {
                if (err) console.log(err);
                else {
                    cb(result);
                }
            });
        });
    },
    
    getLogDistributionByReport: function(id, cb) {
        var dist = [];
        var testsToIterate = 0;
        
        Test.find({
            owner: id,
            childNodesCount: 0
        }).exec(function(err, result) {          
            if (err) console.log(err);
            
            testsToIterate = result.length;
            
            if (testsToIterate > 0) {
                for (var ix = 0; ix < result.length; ix++) {

                    Log.native(function(err, collection) {
                        collection.aggregate(
                        [
                            { $match: { owner: new ObjectId(result[ix].id) } },
                            { $group: 
                                { 
                                    _id: '$status',
                                    count: { $sum: 1 } 
                                },
                            },
                        ],
                        function(err, logs) {
                            if (err) console.log(err);
                            else dist.push(logs);
                            
                            if (--testsToIterate == 0)
                                cb(dist);
                        });
                    })
                }
            }
        });
    },
    
    getGroupsWithCounts(matcher, groupBy, sortBy, limit, cb) {
        Test.native(function(err, collection) {
            collection.aggregate(
            [
                { $match: matcher },
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

