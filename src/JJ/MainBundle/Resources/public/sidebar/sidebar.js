'use strict'

angular.module('sidebar', [])

    .controller('sidebarCtrl', ['playList', '$log', '$scope', function(playList, $log, $scope) {
        $log.info('sidebarCtrl');

        $scope.playList = playList.getPlayList();

    }])
;
