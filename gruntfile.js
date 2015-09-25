module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            options: {
                compress: true  //minifying the result
            },
            website: {
                files: {
                    './app/static/css/speler.min.css': [
                        './bower_components/bootstrap/dist/css/bootstrap.css',
                        './bower_components/bootstrap/dist/css/bootstrap-theme.css',
                        './bower_components/react-smallgrid/dist/smallgrid.css',
                        './assets/less/speler.less',
                    ]
                }
            }
        },

        concat: {
            options: {
                separator: '\n'
            },
            vendor: {
                files: {
                    './app/static/js/vendor.min.js': [
                        './bower_components/jquery/dist/jquery.min.js',
                        './bower_components/bootstrap/dist/js/bootstrap.min.js',
                        './bower_components/lodash/lodash.min.js',
                        './bower_components/react/react.min.js',
                        './bower_components/react-smallgrid/dist/smallgrid.min.js'
                    ]
                }
            },
            jsx: {
                files: {
                    './assets/js/react-speler.jsx': './assets/js/jsx/**/*.jsx'
                }
            }
        },

        babel: {
            options: {
                sourceMap: false
            },
            jsx: {
                files: {
                    './assets/js/react-speler.js': './assets/js/react-speler.jsx'
                }
            }
        },

        uglify: {
            options: {
                mangle: true,  // Use if you want the names of your functions and variables unchanged
            },
            jsx: {
                files: {
                    './app/static/js/speler.min.js': ['./assets/js/react-speler.js'],
                }
            }
        },

        watch: {
            options: {
                spawn: false,
                reload: true,
            },

            less: {
                files: [
                    './assets/less/**/*.less'
                ],
                tasks: ['less'],
                options: {
                    livereload: true,
                }
            },

            jsx: {
                files: [
                    './assets/js/**/*.jsx'
                ],
                tasks: ['concat:jsx', 'babel:jsx', 'uglify:jsx'],
                options: {
                    livereload: true,
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['less', 'concat', 'babel', 'uglify', 'watch']);
};