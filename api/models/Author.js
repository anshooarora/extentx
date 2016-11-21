/**
* Author.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      /* tests (many) <-> authors (many)
       * tests and authors have a many to many relationship
       *   - a test can be assigned with one or more authors
       *   - a author can have one or more tests
       *  In Waterline, from the Author model, to find tests:
       *   Author.find().populate('tests')..
       */
      tests: {
          collection: 'test',
          via: 'authors'
      },
      
      project: {
          model: 'project'
      },

      /* Owner
       * A report can have one or more authors
       * There is a one-to-many relationship between report and author
       * In Waterline, from the Report model, it is possible to do:
       *   Report.find().populate('authors').. 
       */
      report: {
          model: 'report'
      },
      
      testName: 'string',
      
      name: 'string',
      status: 'string'
  },
  
  getDistinctNames: function(cb) {
    Author.native(function(err, collection) {
        collection.distinct('name', function(err, result) {
            if (err) console.log(err);
            else cb(result);
        });
    });
  },
};

