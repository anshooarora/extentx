/**
* Log.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      test: {
          model: 'test'
      },
      
      project: {
          model: 'project'
      },
      
      report: {
          model: 'report'
      },

      media: {		
          collection: 'media',		
          via: 'log'		
      },
      
      testName: 'text',
      
      sequence: 'number',
      status: {
          type: 'string',
          enum: ['pass', 'fail', 'fatal', 'error', 'warning', 'skip', 'info'],
          defaultsTo: 'unknown'
      },
      details: 'text',
      timestamp: 'date'
  },
  
  getLogs: function(json, cb) {
      Log.find(
          json
      ).exec(function(err, result) {
          if (err) console.log('getLogs -> ' + err);
            
          cb(result);
      });
  },
  
  getGroupsWithCounts: function(matcher, groupBy, cb) {
        Log.native(function(err, collection) {
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
};

