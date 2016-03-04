/**
* Test.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      owner: {
          model: 'report'
      },
      
      logs: {
        collection: 'log',
        via: 'owner'
      },
      
      categories: {
          collection: 'category',
          via: 'owner'
      },
      
      authors: {
          collection: 'author',
          via: 'owner'
      },

      name: 'text',
      status: {
          type: 'string',
          enum: ['pass', 'fail', 'fatal', 'error', 'warning', 'skip', 'unknown'],
          defaultsTo: 'unknown'
      },
      description: 'text',
      warnings: 'text',
      startTime: 'date',
      endTime: 'date',
      childNodesCount: 'number'
  }
};

