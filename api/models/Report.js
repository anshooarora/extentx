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
  
  getReport: function(id, cb) {
    Report.findOne({
        id: id
    }).exec(function(err, result) {
        if (err) console.log('ReportService.getReport -> ' + err);
        
        cb(result);
    });
  },
  
  getDistribution: function(id, cb) {
      var dist = {
          testDistribution: null,
          logDistribution: null
      };
      
      Report.getTestDistribution(id, function(d1) {
          dist.testDistribution = d1;

          Report.getLogDistribution(id, function(d2) {
              dist.logDistribution = d2;

              cb(dist);
          })
      });
  },
  
  getTestDistribution: function(id, cb) {
      Test.native(function(err, collection) {
        collection.aggregate(
        [
            { $match: { owner: new ObjectId(id), childNodesCount: 0 } },
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

                Test.getNodeDistributionByReport(id, function(nodes) {
                    if (nodes.length > 0)
                        result = result.concat(nodes);

                    cb(result);
                });
            }
        });
    });
  },
  
  getLogDistribution: function(id, cb) {
      var dist = [];
      
      Report.findOne({
          id: id
      }).exec(function(err, result) {
          if (err) console.log('models.Report.getLogDistribution -> ' + err);
      });
      
      Test.getLogDistributionByReport(id, function(dist1) {
          dist.push(dist1);

          Node.getLogDistributionByReport(id, function(dist2) {
            dist.push(dist2);

            dist = dist1.concat(dist2);

            cb(dist);
          })
      });
  }
};

