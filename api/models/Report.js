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

      exceptions: {
          collection: 'exception',
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

      environment: {
          collection: 'environment',
          via: 'report'
      },

      status: 'string',
      name: 'string',
      startTime: 'date',
      endTime: 'date',
      duration: 'integer',

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
      exceptionsParentLength: 'number',

      childLength: 'number',
      passChildLength: 'number',
      failChildLength: 'number',
      fatalChildLength: 'number',
      errorChildLength: 'number',
      warningChildLength: 'number',
      skipChildLength: 'number',
      infoChildLength: 'number',
      exceptionsChildLength: 'number',

      grandChildLength: 'number',
      passGrandChildLength: 'number',
      failGrandChildLength: 'number',
      fatalGrandChildLength: 'number',
      errorGrandChildLength: 'number',
      warningGrandChildLength: 'number',
      skipGrandChildLength: 'number',
      infoGrandChildLength: 'number',
      exceptionsGrandChildLength: 'number',
  }
};

