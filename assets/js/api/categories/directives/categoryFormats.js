angular.module('ExtentX').
    directive('categoryFormats', ['$rootScope', function($rootScope) {
        var navWidth, reportListColWidth, categoryListColWidth, usedWidth;
        
        function init() { 
            navWidth = parseInt($('#slide-out').css('width').replace('px', ''));
            reportListColWidth = parseInt($('.category-view .report-list').css('width').replace('px', ''));
            categoryListColWidth = parseInt($('.category-view .category-list').css('width').replace('px', ''));
            usedWidth = navWidth + reportListColWidth + categoryListColWidth;
        }

        setDetailsViewContrainerWidths();

        $(window).resize(function() {
            setDetailsViewContrainerWidths();
        });

        function setDetailsViewContrainerWidths() {
            init();
                
            if (!$('.category-view ') || $('.category-view ').length === 0) return;

            var freeWidth = $(document).width() - usedWidth - 5;
            $('.category-view .test-list').css('width', freeWidth);
        }
        
        $('body').click(function(evt) {
            var t = $(evt.target);
            
            if (t.is('#expand-sidenav') || t.is('#expand-sidenav i')) {
                setTimeout(function() {
                    init();
                    setDetailsViewContrainerWidths();
                }, 300);
            }

            if (t.is('.report-name')) {
                $('.test').remove();
                $('.report-name').removeClass('active');
                t.addClass('active');
            }

            if (t.is('.category-name')) {
                $('.category-name').removeClass('active');
                t.addClass('active');
            }
        })

        return {
            restrict: 'A'
        }
    }]);
