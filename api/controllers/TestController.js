/**
 * TestController
 *
 * @description :: Server-side logic for managing Test details
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var ObjectId = require('mongodb').ObjectID;

module.exports = {
    getHistory: function(req, res) {
        var id = '';
        if (req.body.query.id) {
            id = req.body.query.id;
        }
        
        Test.getTests({ name: req.body.query.name, id: {$ne: id} }, function(tests) {
            res.json(tests);
        });
    },
    
    getTestById: function(req, res) {
        Test.getTest({ id: req.body.query.id }, function(test) {
            res.json(test);
        });
    },
};

