/**
 * StatusService
 *
 * @description :: Server-side logic for managing status entities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getIcon: function(status, cb) {
        switch (status) {
            case 'pass': cb('check circle icon'); break;
            case 'fail': cb('remove circle icon'); break;                
            case 'fatal': cb('warning sign icon'); break;
            case 'error': cb('warning sign icon'); break;
            case 'warning': cb('warning icon'); break;
            case 'skip': cb('chevron circle right icon'); break;                
            case 'info': cb('info circle icon'); break;
            default:
                cb('question icon');
                break;
        };
    },
};
