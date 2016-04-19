angular.module('ExtentX').
    directive('navigationState', ["$rootScope", function($rootScope) {
        $("#expand-sidenav").click(function() {
            $rootScope.sideNavToggled = !$rootScope.sideNavToggled;

            $("#expand-sidenav").children('i').toggleClass('fa-arrow-circle-o-right fa-arrow-circle-o-left');
            $("#slide-out").toggleClass("expanded");
            $(".container.main, .navbar").toggleClass("padded");
            
            var items = $('.side-nav .item-name');
            if (items.eq(0).hasClass('hidden')) {
                setTimeout(function() {
                    items.removeClass('hidden');
                }, 150);
            } else {
                items.addClass('hidden');
            }
        });
        
        return {
            restrict: 'A'
        }
    }]);
    