/**
 * FileController
 *
 * @description :: Server-side logic for managing Files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var ObjectId = require('mongodb').ObjectID;

module.exports = {

    upload: function(req, res) {
        var reportId = req.body.reportId,
            testId = req.body.testId,
            logId = req.body.logId,
            id = req.body.id,
            name = req.body.name,
            mediaType = req.body.mediaType;
        
        if (typeof logId !== 'undefined')		
             logId = ObjectId(logId);
             
        req.file('f').upload({}, function whenDone(err, uploadedFile) {
            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFile.length === 0){
                return res.badRequest('No file was uploaded');
            }

            var targetPath = 'uploads/' + reportId + '/' + testId + '/' + name,
                movePath = '.tmp/public/' + targetPath;

            FileService.moveFile(uploadedFile[0].fd, movePath);

            Media.update(
                { id: id }, 
                { 
                    path: targetPath,
                    log: logId
                }
            ).exec(function afterwards(err, updated) { });
        });

        res.send(200);
    }

};

