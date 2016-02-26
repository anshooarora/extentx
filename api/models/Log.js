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
      
      reportId: 'string',
      
      testName: 'text',
      
      logSequence: 'number',
      status: {
          type: 'string',
          enum: ['pass', 'fail', 'fatal', 'error', 'warning', 'skip', 'info', 'unknown'],
          defaultTo: 'unknown'
      },
      stepName: 'text',
      details: 'text',
      timestamp: 'date'
  }
};

