/**
* Category.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      owner: {
          model: 'test'
      },
      
      testName: 'string',
      
      reportId: 'string',
      
      name: 'string',
      status: 'string'
  },
  
  getNames: function(cb) {
    Category.native(function(err, collection) {
        collection.distinct('name', function(err, result) {
            if (err) console.log(err);
            else cb(result);
        });
    });
  },
  
  getGroupsWithCounts: function(matcher, groupBy, cb) {
    Category.native(function(err, collection) {
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

