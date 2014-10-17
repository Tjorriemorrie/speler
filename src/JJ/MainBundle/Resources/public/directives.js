'use strict'

angular.module('directives', [])

    .directive('dateTimePicker', function() {
        return {
            restrict: 'E',
            require: ['ngModel'],
            scope: {
                ngModel: '='
            },
            replace: true,
            transclude: true,
            template:
                '<div class="form-group">' +
                    '<label for="formLeadDate" class="control-label" ng-transclude></label>' +
                    '<div class="input-group">' +
                        '<input type="text" id="formLeadDate" class="form-control" ngModel>' +
                        '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>' +
                    '</div>' +
                '</div>',
            link: function(scope, element, attrs) {
                var input = element.find('input');

                input.datetimepicker({
                    format: "yyyy-mm-dd hh:ii",
                    showMeridian: false,
                    autoclose: true,
                    todayBtn: true,
                    todayHighlight: true,
                    //initialDate: new Date(scope.ngModel)
                });

                element.bind('blur keyup change', function() {
                    scope.ngModel = input.val();
                    //console.info('date-time-picker event', input.val(), scope.ngModel);
                });

                scope.ngModel = input.val();
            }
        }
    })

    .directive('recommend', function($http) {
        return {
            restrict: 'E',
            template: '<div class="alert alert-default">' +
                    '{{recommendation}}' +
                '</div>',
            link: function(scope, element, attrs) {
                var defaultRecommendation = 'No recommendation currently';
                scope.recommendation = defaultRecommendation;
                var req = $http.get(URL_SITE + '/recommend');
                req.success(function(album) {
                    console.log(album);
                    if (album) {
                        scope.recommendation = 'Remove ' + album.artist.name + ' - ' + album.name;
                    } else {
                        scope.recommendation = defaultRecommendation;
                    }
                });
                req.error(function(error) {
                    console.log(error);
                    alert('error');
                });
            }
        }
    })
;
