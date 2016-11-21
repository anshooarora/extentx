angular.module('ExtentX').
    directive('reportDetailsView', ['$rootScope', function($rootScope) {
        var navWidth, testNamesColWidth, usedWidth;
        
        function init() { 
            navWidth = parseInt($('#side-nav').css('width').replace('px', ''));
            testNamesColWidth = parseInt($('.report-view .test-name-panel').css('width').replace('px', ''));
            usedWidth = navWidth + testNamesColWidth;
        }

        setDetailsViewContrainerWidths();

        $(window).resize(function() {
            setDetailsViewContrainerWidths();
        });

        function setDetailsViewContrainerWidths() {
            init();

            if (!$('.report-view') || $('.report-view').length === 0) return;

            var freeWidth = $(document).width() - usedWidth;

            $('.report-view .test-panel, .report-view .history-panel').css('width', (freeWidth / 2));
            $('.report-view .history-panel').css('left', usedWidth + (freeWidth / 2) - 5);
            angular.element(".navbar").addClass("hidden");
        }
        
        $('body').click(function(evt) {
            var t = $(evt.target);

            if (t.is('.test-name')) {
                $('.test-name').removeClass('active');
                t.addClass('active');
            }
        })

        return {
            restrict: 'E',
            template: '<div></div>',
            link: function($scope, element, attrs) {
                $scope.setContrainerWidths = function() {
                    setTimeout(function() {
                        setDetailsViewContrainerWidths();
                    }, 50);
                }
            }
        }
    }]);