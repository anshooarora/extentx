/**
 * TestController
 *
 * @description :: Server-side logic for managing Test details
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var ObjectId = require('mongodb').ObjectID,
    _ = require('lodash');

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

    getTestsForCategory: function(req, res) {
        var catId = req.body.id;

        Category.find({ id: catId }).populate('tests').exec(function(err, category) {
            if (err) res.json(null);
            else {
                var testIds = [];
                _(category[0].tests).forEach(function(test) {
                    testIds.push(ObjectId(test.id));
                });

                Test.getTests({ id: testIds }, function(tests) {
                    if (err) res.json(null);
                    else res.json(tests);
                });
            }
        });
    },
};

