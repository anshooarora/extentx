/**
 * FileController
 *
 * @description :: Server-side logic for managing File details
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    upload: function(req, res) {
        var reportId = req.body.reportId,
            testId = req.body.testId,
            id = req.body.id,
            name = req.body.name,
            mediaType = req.body.mediaType;

        req.file('f').upload({
            // don't allow the total upload size to exceed ~10MB
            maxBytes: 10000000
        }, function whenDone(err, uploadedFile) {
            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFile.length === 0){
                return res.badRequest('No file was uploaded');
            }

            var newPath = 'assets/images/' + testId + '/' + name;
            FileService.moveFile(uploadedFile[0].fd, newPath);

            Media.update( 
                { id: id }, 
                { path: newPath }
            ).exec(function afterwards(err, updated) { });
        });

        res.send(200);
    }
};
