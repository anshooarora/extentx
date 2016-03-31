angular.module('ExtentX').
    directive('testDetailsViewer', function() {
        const usedWidth = 480;
        
        setDetailsViewContrainerWidths();

        $(window).resize(function() {
            setDetailsViewContrainerWidths();
        });

        function setDetailsViewContrainerWidths() {
            if (!$('.details-view') || $('.details-view').length === 0) return;
            
            var freeWidth = $(document).width() - usedWidth;
            
            if ($('.details-view .historical-details').hasClass('hidden')) {
                $('.details-view .current-details').css('width', freeWidth);
            }
            else {
                $('.details-view .current-details, .details-view .historical-details').css('width', (freeWidth / 2));
                $('.details-view .historical-details').css('left', usedWidth + (freeWidth / 2) - 10);
            }
        }
        
        $('body').click(function(evt) {
            var t = $(evt.target);
            
            if (t.is('.test-name')) {
                t = t.closest('.test');
            }
            
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
    });
