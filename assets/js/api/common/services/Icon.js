angular.module('ExtentX').
    factory('Icon', function() {
        return {
            getIcon: function(status) {
                switch (status) {
                    case 'pass': return('fa fa-check-circle');
                    case 'fail': return('fa fa-times-circle');                
                    case 'fatal': return('fa fa-times-circle');
                    case 'error': return('fa fa-exclamation-circle');
                    case 'warning': return('fa fa-warning');
                    case 'skip': return('fa fa-chevron-circle-right');                
                    case 'info': return('fa fa-info-circle');
                    default:
                        return('fa fa-question');
                };
            }
        }
    });