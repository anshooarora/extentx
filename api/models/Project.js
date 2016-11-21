/**
* Project.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        /* A project can have one or more reports
        * There is a one-to-many relationship between project and reports
        * In Waterline, from the Project model, it is possible to do:
        *   Project.find().populate('reports')..
        * To find all reports of a given project, use:
        *   Report.find({ project: projectId }).. 
        */
        reports: {
            collection: 'report',
            via: 'project'
        },

        environment: {
            collection: 'environment',
            via: 'project'
        },
        
        name: 'string'
    },

    getProjects: function(cb) {
        Project.find().exec(function(err, res) {
            cb(res);
        });
    },
};

