/**
 * ProjectController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
    switchProject: function(req, res) {
        req.session.project = null;
        
        var project = req.body.query.name;

        if (typeof project !== "undefined" && project !== null && project !== "")
            req.session.project = project;   
        
        res.send(200);
    },

    getProjects: function(req, res) {
        Project.find({}).exec(function(err, projects) {
            res.json(projects);
        })
    },

    getProjectsWithDeps: function(req, res) {
        Project.find({}).populateAll().exec(function(err, projectsInfo) {
            res.json(projectsInfo);
        });
    },

};

