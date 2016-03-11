/**
* Log.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      owner: {
          model: 'test'
      },
      
      report: {
          model: 'report'
      },
      
      testName: 'text',
      
      logSequence: 'number',
      status: {
          type: 'string',
          enum: ['pass', 'fail', 'fatal', 'error', 'warning', 'skip', 'info', 'unknown'],
          defaultsTo: 'unknown'
      },
      stepName: 'text',
      details: 'text',
      timestamp: 'date'
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

