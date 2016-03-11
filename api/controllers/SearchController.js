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
                        
        var currentPage = typeof req.query.page === 'undefined' || req.query.page === ''
                        ? 1
                        : parseInt(req.query.page);
                        
        /* pagination */
        var limit = 30;
        var url = req.url;
        (req.url.indexOf('?') > 0) && (url = req.url.split('?')[1].replace(/&page=\d+/, ''));
        (req.url.indexOf('undefined') > 0) && (url = req.url.replace(/undefined/g, ''));
        
        Test.count({
            startTime: { '>=': startDate },
            endTime: { '<=': endDate },
            name: name,
            status: status
        }).exec(function(err, count) {
            var pages = (count / limit);
            if ((count / limit).toString().indexOf('.') > 0) {
                pages = parseInt((count / limit).toString().split('.')[0]) + 1;
            }
            
            Test.find({
                startTime: { '>=': startDate },
                endTime: { '<=': endDate },
                name: name,
                status: status
            }).populateAll().paginate({ page: currentPage, limit: limit }).exec(function(err, result) {
                if (err) console.log('SearchController.search -> ' + err);

                Category.getNames(function(cats) {
                    res.view('search', { 
                        query: req.query, 
                        tests: result, 
                        cats: cats, 
                        pages: pages, 
                        currentPage: currentPage, 
                        url: url 
                    });
                });
            });
        });
    },
};