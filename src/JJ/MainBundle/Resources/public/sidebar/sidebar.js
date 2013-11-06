'use strict'

angular.module('sidebar', [])

    .controller('sidebarCtrl', ['playList', '$log', '$scope', function(playList, $log, $scope) {

        $scope.playList = playList.getPlayList();

    }])
;
