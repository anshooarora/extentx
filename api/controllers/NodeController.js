/**
 * NodeController
 *
 * @description :: Server-side logic for managing Node details
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getChildNodesByParentId: function(req, res) {
        var parentId = req.body.id;
        
        Node.getChildren({ test: parentId }, function(children) {
            res.json(children);
        });
    },

    getMediaByNodeId: function(req, res) {
        var id = req.body.id;

        Node.findOne({ id: id }).populate('media').exec(function(err, media) {
            res.json(media);
        })
    },
};

