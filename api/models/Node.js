/**
* Node.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      reportId: 'string',
      
      testId: 'string',
      
      name: 'text',
      level: 'number',
      status: 'string',
      description: 'text',
      startTime: 'date',
      endTime: 'date',
      childNodesCount: 'number',
  }
};

