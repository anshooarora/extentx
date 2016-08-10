/**
* Node.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var ObjectId = require('mongodb').ObjectID;

module.exports = {

  attributes: {
      test: {
          model: 'test'
      },
      
      report: {
          model: 'report'
      },
      
      parentTestName: 'text',
      
      /* A node can have one or more logs
       * There is a one-to-many relationship between a node and log
       * In Waterline, from the Node model, to find logs:
       *   Node.find().populate('logs')..
       */ 
      logs: {
        collection: 'log',
        via: 'test'
      },
      
      name: 'text',
      level: 'number',
      status: {
          type: 'string',
          enum: ['pass', 'fail', 'fatal', 'error', 'warning', 'skip', 'info', 'unknown'],
          defaultsTo: 'unknown'
      },
      description: 'text',
      startTime: 'date',
      endTime: 'date',
      childNodesCount: 'number',
  },
  
  getNode: function(json, cb) {
      Node.findOne(
          json
      ).populateAll().exec(function(err, result) {
          if (err) console.log('getNode -> ' + err);
            
          cb(result);
      });
  },

  getChildren: function(json, cb) {
      Node.find(
          json
      ).populateAll().exec(function(err, children) {
          if (err) console.log('getChildren -> ' + err);

          cb(children);
      });
  },

  getGroupsWithCounts: function(matcher, groupBy, sortBy, limit, cb) {
        Node.native(function(err, collection) {
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

