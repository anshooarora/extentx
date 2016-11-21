/**
 * SearchController
 *
 * @description :: Server-side logic for managing Searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
    searchTests: function(req, res) {
        var page = 1;
        if (typeof req.body.page !== "undefined")
            page = req.body.page;

        var startDate = typeof req.body.query.startDate === 'undefined' || req.body.query.startDate === '' 
                        ? new Date('01/01/1900') 
                        : new Date(req.body.query.startDate);
                        
        var endDate = typeof req.body.query.endDate === 'undefined' || req.body.query.endDate === ''
                        ? new Date() 
                        : new Date(req.body.query.endDate + ' 23:59:59');

        var regex = req.body.query.regex;

        var name = typeof req.body.query.name === 'undefined' || req.body.query.name === '' 
                        ? ''
                        : req.body.query.name;
        
        if (name !== '') {
            switch (regex) {
                case 'endsWith':
                    name = { 'endsWith': name };
                    break;
                case 'startsWith':
                    name = { 'startsWith': name };
                    break;
                case 'contains':
                    name = { 'like': '%' + name + '%' };
                    break;
                default:
                    break;
            }
        } else name = { $ne: null };

        var status = typeof req.body.query.status === 'undefined' || req.body.query.status === '' || (req.body.query.status.length === 1 && req.body.query.status[0] === '')
                        ? {$ne : null}
                        : req.body.query.status;
                        
        var categories = typeof req.body.query.category === 'undefined' || req.body.query.category === ''
                        ? {$ne : null} 
                        : req.body.query.category;

        var project = { $ne: null };
        if (typeof req.session.project !== 'undefined' && req.session.project != null) 
            project = req.session.project;

        Project.find({ name: project }).exec(function(err, projects) {
            if (projects.length && projects.length === 1) project = projects[0].id;

            Test.find({
                startTime: { '>=': startDate },
                endTime: { '<=': endDate },
                name: name,
                status: status
            }).paginate({ page: page, limit: 10 }).populateAll().exec(function(err, tests) {
                res.json(tests);
            })
        });
    },

};

