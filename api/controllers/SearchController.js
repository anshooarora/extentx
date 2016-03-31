/**
 * SearchController
 *
 * @description :: Server-side logic for managing the search feature
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    search: function(req, res) {
        req.query = req.body.query;

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

        var status = typeof req.query.status === 'undefined' || req.query.status === '' 
                        ? {$ne : null} 
                        : req.query.status;
                        
        var categories = typeof req.query.category === 'undefined' || req.query.category === ''
                        ? {$ne : null} 
                        : req.query.category;

        /*console.log({
            startTime: startDate,
            endTime: endDate,
            regex: regex,
            name: name,
            status: status,
            category: categories
        });*/
        
        Test.find({
            startTime: { '>=': startDate },
            endTime: { '<=': endDate },
            name: name,
            status: status
        }).populateAll().exec(function(err, result) {
            if (err) console.log('SearchController.search -> ' + err);
            
            var out = [];
            
            var sendRes = function() {
                res.json({ 
                    query: req.query, 
                    tests: out, 
                });
            }
            
            var getNodesWithLogs = function(nodeArray, cb) {
                if (nodeArray.length === 0) cb(nodeArray);

                var itemsToIterateIn = nodeArray.length;
                
                for (var ix = 0; ix < nodeArray.length; ix++) {
                    (function(ix) {
                        Log.getLogs({ test: nodeArray[ix].id }, function(logs) {
                            nodeArray[ix].logs = logs;
                            
                            if (--itemsToIterateIn === 0) cb(nodeArray);
                        });
                    })(ix);
                }
            }
            
            var itemsToIterate = result.length;
            
            for (var ix = 0; ix < result.length; ix++) {
                (function(ix) {
                    out[ix] = result[ix].toJSON();
                    
                    if (result[ix].nodes.length > 0) {
                        getNodesWithLogs(result[ix].toJSON().nodes, function(nodes) {
                            out[ix].nodes = nodes;
                            
                            (--itemsToIterate === 0) && sendRes();
                        });
                    }
                    else {
                        (--itemsToIterate === 0) && sendRes();
                    }
                })(ix)
            }
        });
    },
};