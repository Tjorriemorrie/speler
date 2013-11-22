'use strict'

angular.module('filters', [])

    .filter('perc', function() {
        return function(input, dec) {
            input = +input;
            if (dec == 2) {
                return Math.round(input * 10000) / 100 + '%';
            } else if (dec == 1) {
                return Math.round(input * 1000) / 10 + '%';
            } else {
                return Math.round(input * 100) + '%';
            }
        }
    })

    .filter('startFrom', function() {
        return function(input, start) {
            if (input instanceof Array) {
                start = +start; //parse to int
                return input.slice(start);
            } else {
                return 0;
            }
        }
    })

    .filter('range', function() {
        return function(input, total) {
            total = parseInt(total);
            for (var i=0; i<total; i++)
                input.push(i);
            return input;
        };
    })
;
