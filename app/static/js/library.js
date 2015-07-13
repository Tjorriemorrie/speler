app.factory('libraryFactory', function ($http) {
    return {
        files: [],
        findFiles: function () {
            console.info('libraryFactory: files...');
            $http.get('/find/files')
                .success(function (data, status, headers, config) {
                    console.info('data = ', data);
                    self.files = data;
                })
                .error(function (data, status, headers, config) {
                    alert('erorr retrieving data!');
                });
        },
        init: function () {
            self = this;
            this.findFiles();
            delete this.init;
            return this;
        }
    }.init();
});


app.directive('ngLibrary', function (libraryFactory) {
    return {
        restrict: 'A',
        templateUrl: '/static/templates/library.html',
        scope: {
        },
        controller: function ($scope) {
            $scope.files = libraryFactory.files;
        },
        link: function ($scope, element, attrs) {

        }
    };
});
