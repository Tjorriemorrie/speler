'use strict';


app.factory('libraryFcty', function ($http) {
    var library = {};

    library.files = [];

    library.findFiles = function () {
        console.info('Library_findfiles...');
        $http.get('/find/files')
            .success(function (data, status, headers, config) {
                console.info('Library_findfiles: success', data);
                library.files = data;
            })
            .error(function (data, status, headers, config) {
                alert('Error retrieving files');
                console.error('Library_findfiles: error', data);
            });
    };

    library.scandir = function () {
        console.info('Library_scandir...');
        return $http.get('/scan/dir')
            .success(function (data, status, headers, config) {
                console.info('Library_scandir: success', data);
                library.findFiles();
            })
            .error(function (data, status, headers, config) {
                alert('Error scanning directory');
                console.error('Library_scandir: error', data);
            });
    };

    library.findFiles();

    return library;
});


app.controller('libraryCtrl', function (libraryFcty, playlistFcty) {
    this.lib = libraryFcty;
    this.refreshLibrary = function () {
        libraryFcty.scandir();
    };
});
