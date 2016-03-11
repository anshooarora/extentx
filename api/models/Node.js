/**
* Node.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var ObjectId = require('mongodb').ObjectID;

module.exports = {

  attributes: {
      owner: {
          model: 'test'
      },
      
      report: {
          model: 'report'
      },
      
      parentTestName: 'text',
      
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
  
  getLogDistributionByReport(id, cb) {
      var dist = [];
      var nodesToIterate = 0;
      
      Node.find({
          report: id
      }).exec(function(err, result) {
          if (err) console.log(err);

          nodesToIterate = result.length;
        
          (nodesToIterate === 0) && (cb(result));
        
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

                    if (--nodesToIterate === 0)
                        cb(dist);
                });
            })
            }  
      });
  },
  
  getGroupsWithCounts(matcher, groupBy, sortBy, limit, cb) {
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

