/**
 * AdminController
 *
 * @description :: Server-side logic for managing admin controls
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var ObjectId = require('mongodb').ObjectID,
    _ = require('lodash');

module.exports = {

    deleteReportsOlderThanXDays: function(req, res) {
        var days = req.body.query,
            dt = new Date(),
            dt = dt.setDate(dt.getDate() - days + 1),
            dt = new Date(dt);
            console.log(dt)
        var reportObj = {
            reportIds: [],
            reportNames: []
        };

        function deleteRels() {
            if (reportObj.reportIds.length > 0) {
                Report.destroy({ id: reportObj.reportIds }).exec(function(err) { if (err) console.log(err); });
                Author.destroy({ report: reportObj.reportIds }).exec(function(err) { if (err) console.log(err); });
                Category.destroy({ report: reportObj.reportIds }).exec(function(err) { if (err) console.log(err); });
                Log.destroy({ report: reportObj.reportIds }).exec(function(err) { if (err) console.log(err); });
                Test.destroy({ report: reportObj.reportIds }).exec(function(err) { if (err) console.log(err); });
                Exception.destroy({ report: reportObj.reportIds }).exec(function(err) { if (err) console.log(err); });
                Media.destroy({ report: reportObj.reportIds }).exec(function(err) { if (err) console.log(err); });

                res.json(reportObj);
            } 
            else {
                console.log('No items match search criteria');
            }
        }

        Report.find({ startTime: { '<': dt } }).exec(function(err, result) {
            _(result).forEach(function(element) {
                reportObj.reportIds.push(element.id);
                reportObj.reportNames.push(element.name);
            });

            deleteRels();
        });
    },

    resetDatabase: function(req, res) {
        try {
            Project.destroy({ }).exec(function(err) { if (err) console.log(err); });
            Report.destroy({ }).exec(function(err) { if (err) console.log(err); });
            Author.destroy({ }).exec(function(err) { if (err) console.log(err); });
            Category.destroy({ }).exec(function(err) { if (err) console.log(err); });
            Log.destroy({ }).exec(function(err) { if (err) console.log(err); });
            Test.destroy({ }).exec(function(err) { if (err) console.log(err); });
            Exception.destroy({ }).exec(function(err) { if (err) console.log(err); });
            Media.destroy({ }).exec(function(err) { if (err) console.log(err); });
            res.send(200);
        } catch(err) {
            res.send(400);
        }       
    },

};