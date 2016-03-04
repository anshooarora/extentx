/**
 * SearchController
 *
 * @description :: Server-side logic for managing the search feature
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    search: function(req, res) {
        var startDate = typeof req.query.startDate === 'undefined' || req.query.startDate === '' 
                        ? new Date('01/01/1900') 
                        : new Date(req.query.startDate);
                        
        var endDate = typeof req.query.endDate === 'undefined' || req.query.endDate === ''
                        ? new Date() 
                        : new Date(req.query.endDate + ' 23:59:59');

        var regex = req.query.regex;

        var name = typeof req.query.name === 'undefined' || req.query.name === '' 
                        ? ''
                        : req.query.name;
        
        switch (regex) {
            case 'startsWith':
                name = new RegExp('^' + name, 'i');
                break;
                
            case 'endsWith':
                name = new RegExp(name + '$')
                break;
                
            case 'contains':
                name = new RegExp(name, 'i');
                break;
                
            default:
                break;
        }
        
        var status = typeof req.query.status === 'undefined' || req.query.status === '' 
                        ? {$ne : null} 
                        : req.query.status;
                        
        var categories = typeof req.query.category === 'undefined' || req.query.category === ''
                        ? {$ne : null} 
                        : req.query.category;

        Test.find({
            startTime: { '>=': startDate },
            endTime: { '<=': endDate },
            name: name,
            status: status
        }).populateAll().exec(function(err, result) {
            if (err) console.log('SearchController.search -> ' + err);

            CategoryService.getNames(function(cats) {
                res.view('search', { query: req.query, tests: result, cats: cats });
            });
        });
    },
};