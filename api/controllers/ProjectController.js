/**
 * ProjectController
 *
 * @description :: Server-side logic for managing Project details
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    switchProject: function(req, res) {
        req.session.project = null;
        
        if (req.body.project !== '' && req.body.project !== 'null' && req.body.project != null)
            req.session.project = req.body.project;   
        
        res.send(200);
    }
};
