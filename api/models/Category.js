/**
* Category.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      /* tests (many) <-> categories (many)
       * tests and categories have a many to many relationship
       *   - a test can be assigned with one or more categories
       *   - a category can have one or more tests
       *  In Waterline, from the Category model, to find tests:
       *   Category.find().populate('tests')..
       */
      tests: {
          collection: 'test',
          via: 'categories'
      },
      
      /* Owner
       * A report can have one or more categories
       * There is a one-to-many relationship between report and category
       * In Waterline, from the Report model, it is possible to do:
       *   Report.find().populate('categories').. 
       */
      report: {
          model: 'report'
      },
      
      testName: 'string',

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

