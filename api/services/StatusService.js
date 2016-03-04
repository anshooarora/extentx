/**
 * StatusService
 *
 * @description :: Server-side logic for managing status entities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getIcon: function(status, cb) {
        switch (status) {
            case 'pass': cb('fa fa-check-circle'); break;
            case 'fail': cb('fa fa-times-circle'); break;                
            case 'fatal': cb('fa fa-times-circle'); break;
            case 'error': cb('fa fa-exclamation-circle'); break;
            case 'warning': cb('fa fa-warning'); break;
            case 'skip': cb('fa fa-chevron-circle-right'); break;                
            case 'info': cb('fa fa-info-circle'); break;
            default:
                cb('fa fa-question');
                break;
        };
    },
};
