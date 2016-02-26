/**
* Report.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var ObjectId = require('mongodb').ObjectID;

module.exports = {

  attributes: {
      tests: {
        collection: 'test',
        via: 'owner'
      },
      
      reportStatus: 'string',
      fileName: 'string',
      startTime: 'date',
      endTime: 'date',
  },
  
  getTestDistribution: function(id, cb) {
      Test.native(function(err, collection) {
        collection.aggregate(
        [
            { $match: { owner: new ObjectId(id) } },
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
                result.unshift({ owner: id });
                cb(result);
            }
        });
    });
  },
  
  getLogDistribution: function(id, cb) {
      var dist = [];
      var itemsToIterate = 0;
      
      var reportDate = '';
      Report.find({
          id: id
      }).sort({startTime: 'desc'}).exec(function(err, result) {
          if (err) console.log('models.Report.getLogDistribution -> ' + err);
          
          reportDate = result[0].startTime;
      });      
      
      Test.find({
          owner: id
      }).exec(function(err, result) {          
          if (err) console.log(err);
          
          if (result.length == 0)
            cb(dist);
          
          itemsToIterate = result.length;
                    
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
                    
                    if (--itemsToIterate == 0)
                        cb(dist);
                });
            })
          }
      });
  }
};

