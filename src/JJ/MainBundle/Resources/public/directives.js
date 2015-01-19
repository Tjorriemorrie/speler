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

    .directive('recommend', function($http, $timeout) {
        return {
            restrict: 'E',
            template: '<div class="alert alert-default" ng-if="recommendation.length > 0">' +
                    '<button class="btn btn-default btn-xs pull-right" ng-if="is_done" ng-click="makeRequest()">refresh</button>' +
                    '{{recommendation}}' +
                '</div>',
            link: function(scope, element, attrs) {
                scope.recommendation = '';
                scope.is_done = true;

                scope.makeRequest = function() {
                    scope.is_done = false;
                    scope.recommendation = 'loading...';
//                    console.info('making recommendation request...');
                    var req = $http.get(URL_SITE + '/recommend');

                    req.success(function(album) {
//                        console.log(album);
                        if (album == '"all ok"') {
                            scope.recommendation = '';
                        } else {
                            var name = album.artist.name + ' - ' + album.name;
                            // incorrect size?
                            if (album.size > album.count_songs) {
                                scope.recommendation = name + ' has ' + album.size + ' songs but found only ' + album.count_songs;
                            }
                            // else remove
                            else {
                                scope.recommendation = name;
                            }
                        }
                    });

                    req.error(function(error) {
                        console.log(error);
                        alert('error');
                    });

                    req.finally(function() {
                        scope.is_done = true;
                    });

                    // bind to refresh
                    $(element).find('button').on('click', function(event) {
//                        console.log('btn clicked');
                        makeRequest();
                    });
                };

                scope.makeRequest();
            }
        }
    })
;
