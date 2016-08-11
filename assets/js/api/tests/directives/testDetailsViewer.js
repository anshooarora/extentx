angular.module('ExtentX').
    directive('testDetailsViewer', ['$rootScope', function($rootScope) {
        var navWidth, testNamesColWidth, usedWidth;
        
        function init() { 
            navWidth = parseInt($('#slide-out').css('width').replace('px', ''));
            testNamesColWidth = parseInt($('.details-view .test-names').css('width').replace('px', ''));
            usedWidth = navWidth + testNamesColWidth;
        }

        setDetailsViewContrainerWidths();

        $(window).resize(function() {
            setDetailsViewContrainerWidths();
        });

        function setDetailsViewContrainerWidths() {
            init();
                
            if (!$('.details-view') || $('.details-view').length === 0) return;

            var freeWidth = $(document).width() - usedWidth - 5;

            /* test names column starts where side-nav ends */
            $('.details-view .test-names').css('left', navWidth);
            
            /* current details start where test-names column ends*/
            $('.details-view .current-details').css('left', usedWidth + 'px');
            
            if ($('.details-view .historical-details').hasClass('hidden')) {
                $('.details-view .current-details').css('width', freeWidth);
            }
            else {
                $('.details-view .current-details, .details-view .historical-details').css('width', (freeWidth / 2));
                $('.details-view .historical-details').css('left', usedWidth + (freeWidth / 2));
            }
        }
        
        $('body').click(function(evt) {
            var t = $(evt.target);
            
            if (t.is('#expand-sidenav') || t.is('#expand-sidenav i')) {
                setTimeout(function() {
                    init();
                    setDetailsViewContrainerWidths();
                }, 300);
            }
            
            if (t.is('.test-name'))
                t = t.closest('.test');
            
            if (t.is('.test')) {
                var clonedTestContent = $('.cloned-content .test-content');
                if (clonedTestContent) {
                    $('.test').filter(function() {
                        return $(this).find('.test-content').length === 0;
                    }).find('.content').append(clonedTestContent.addClass('hidden'));
                }
                
                $('.test').removeClass('active');
                
                var d = $('.current-details');
                
                t.addClass('active');
                
                $('.details-view .historical-details').addClass('hidden');
                setDetailsViewContrainerWidths();
                
                var testName = t.find('.test-name').html();
                var testContent = t.find('.test-content'); // no cloning, direct append
                
                d.find('.test-name').html(testName);
                d.find('.cloned-content').html('').append($(testContent).removeClass('hidden'));
            }

            if (t.is('.history-link')) {
                $('.details-view .historical-details, .historical-details .test-content').removeClass('hidden');
                setDetailsViewContrainerWidths();
            }
        })

        return {
            restrict: 'A'
        }
    }]);
