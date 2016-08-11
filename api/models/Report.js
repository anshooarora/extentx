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

      status: 'string',
      fileName: 'string',
      startTime: 'date',
      endTime: 'date',

      /* 
      * stats 
      */
      parentLength: 'number',
      passParentLength: 'number',
      failParentLength: 'number',
      fatalParentLength: 'number',
      errorParentLength: 'number',
      warningParentLength: 'number',
      skipParentLength: 'number',
      unknownParentLength: 'number',
    
      childLength: 'number',
      passChildLength: 'number',
      failChildLength: 'number',
      fatalChildLength: 'number',
      errorChildLength: 'number',
      warningChildLength: 'number',
      skipChildLength: 'number',
      unknownChildLength: 'number',
      infoChildLength: 'number',

      grandChildLength: 'number',
      passGrandChildLength: 'number',
      failGrandChildLength: 'number',
      fatalGrandChildLength: 'number',
      errorGrandChildLength: 'number',
      warningGrandChildLength: 'number',
      skipGrandChildLength: 'number',
      unknownGrandChildLength: 'number',
      infoGrandChildLength: 'number'
  },
  
  getReport: function(id, cb) {
    Report.findOne({
        id: id
    }).exec(function(err, result) {
        if (err) console.log('ReportService.getReport -> ' + err);
        
        cb(result);
    });
  },
};

