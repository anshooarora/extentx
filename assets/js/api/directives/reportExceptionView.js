angular.module('ExtentX').
    directive('reportExceptionView', ['$rootScope', function($rootScope) {
        var usedWidth = 890;

        setDetailsViewContrainerWidths();

        $(window).resize(function() {
            setDetailsViewContrainerWidths();
        });

        function setDetailsViewContrainerWidths() {
            if (!$('.exception-report-view') || $('.exception-report-view').length === 0) return;

            var freeWidth = $(document).width() - usedWidth;

            $('.exception-report-view .exception-test-panel').css('width', freeWidth);
            angular.element(".navbar").addClass("hidden");
        }
        
        $('body').click(function(evt) {
            var t = $(evt.target);

            if (t.is('.report-name')) {
                $('.report-name').removeClass('active');
                t.addClass('active');
            }
        })

        return {
            restrict: 'A',
            template: '<div></div>',
            link: function($scope, element, attrs) {
                $scope.setContrainerWidths = function() {
                    console.log('in')
                    setTimeout(function() {
                        setDetailsViewContrainerWidths();
                    }, 50);
                }
            }
        }
    }]);