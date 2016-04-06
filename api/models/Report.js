/**
* Report.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var ObjectId = require('mongodb').ObjectID;

module.exports = {

  attributes: {
      project: {
          model: 'project',
      },
      
      /* A report can have one or more tests
       * There is a one-to-many relationship between report and test
       * In Waterline, from the Report model, it is possible to do:
       *   Report.find().populate('tests').. 
       */
      tests: {
        collection: 'test',
        via: 'report'
      },
      
      /* A report can have one or more categories
       * There is a one-to-many relationship between report and category
       */
      categories: {
          collection: 'category',
          via: 'report'
      },
      
      /* A report can have one or more authors
       * There is a one-to-many relationship between report and author
       */
      authors: {
          collection: 'author',
          via: 'report'
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
            { $match: { report: new ObjectId(id), childNodesCount: 0 } },
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
                Report.findOne({ id: id }).exec(function(err, report) { 
                    Test.getNodeDistributionByReport(id, function(nodes) {
                        if (nodes && nodes.distribution.length)
                            result = nodes.distribution.concat(result);
                        
                        cb({
                            report: report,
                            distribution: result
                        });
                    });
              });
            }
        });
    });
  },
  
  getLogDistribution: function(id, cb) {
      Report.findOne({
          id: id
      }).exec(function(err, report) {
        Log.native(function(err, collection) {
            collection.aggregate(
            [
                { $match: { report: new ObjectId(report.id) } },
                { $group: 
                    { 
                        _id: '$status',
                        count: { $sum: 1 } 
                    },
                },
            ],
            function(err, logs) {
                if (err) console.log(err);
                else cb({
                    report: report,
                    distribution: logs
                });
            });
        })
      });
  }
};

