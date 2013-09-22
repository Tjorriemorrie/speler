'use strict'

angular.module('library', [])

    .controller('librarySongsCtrl', ['songsServ', '$filter', 'ngTableParams', 'storage', '$scope', function(songsServ, $filter, ngTableParams, storage, $scope) {

        var data = [];

        $scope.tableParams = new ngTableParams({
            page: 1, // show first page
            total: data.length, // length of data
            count: 25, // count per page
            filter: {
                name: '' // initial filter
            }
        });

        // watch for changes of parameters
        $scope.$watch('tableParams', function(params) {
            // use build-in angular filter
            var filteredData = params.filter ?
                $filter('filter')(data, params.filter) :
                data;

            var orderedData = params.sorting ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

            // slice array data on pages
            $scope.songs = orderedData.slice(
                (params.page - 1) * params.count,
                params.page * params.count
            );
        }, true);

        songsServ.findAll().then(function(result) {
            data = result;
            $scope.tableParams.total = data.length;
        });
    }])
    
    .controller('libraryAlbumsCtrl', ['albumsServ', '$filter', 'ngTableParams', 'storage', '$scope', function(albumsServ, $filter, ngTableParams, storage, $scope) {

        var data = [];

        $scope.tableParams = new ngTableParams({
            page: 1, // show first page
            total: data.length, // length of data
            count: 25, // count per page
            filter: {
                name: '' // initial filter
            }
        });

        // watch for changes of parameters
        $scope.$watch('tableParams', function(params) {
            // use build-in angular filter
            var filteredData = params.filter ?
                $filter('filter')(data, params.filter) :
                data;

            var orderedData = params.sorting ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

            // slice array data on pages
            $scope.albums = orderedData.slice(
                (params.page - 1) * params.count,
                params.page * params.count
            );
        }, true);

        albumsServ.findAll().then(function(result) {
            data = result;
            $scope.tableParams.total = data.length;
        });
    }])

    .controller('libraryArtistsCtrl', ['artistsServ', '$filter', 'ngTableParams', 'storage', '$scope', function(artistsServ, $filter, ngTableParams, storage, $scope) {

        var data = [];

        $scope.tableParams = new ngTableParams({
            page: 1, // show first page
            total: data.length, // length of data
            count: 25, // count per page
            filter: {
                name: '' // initial filter
            }
        });

        // watch for changes of parameters
        $scope.$watch('tableParams', function(params) {
            // use build-in angular filter
            var filteredData = params.filter ?
                $filter('filter')(data, params.filter) :
                data;

            var orderedData = params.sorting ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

            // slice array data on pages
            $scope.artists = orderedData.slice(
                (params.page - 1) * params.count,
                params.page * params.count
            );
        }, true);

        artistsServ.findAll().then(function(result) {
            data = result;
            $scope.tableParams.total = data.length;
        });
    }])
;
