angular.module('ExtentX').
    factory('Icon', function() {
        return {
            getIcon: function(status) {
                switch (status) {
                    case 'pass': return('check_circle');
                    case 'fail': return('cancel');                
                    case 'fatal': return('cancel');
                    case 'error': return('error');
                    case 'warning': return('warning');
                    case 'skip': return('redo');                
                    case 'info': return('info_outline');
                    default:
                        return('fa fa-question');
                };
            }
        }
    });