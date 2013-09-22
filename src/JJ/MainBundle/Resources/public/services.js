'use strict'

angular.module('services', [])

    .factory('usersServ', ['$http', function($http) {
        return {
            getUser: function() {
                return $http.get(URL_SITE + '/user').then(function(result) {
                    return result.data;
                });
            }
        }
    }])

    .factory('clientsServ', ['$http', function($http) {
        return {
            findAll: function() {
                return $http.get(URL_SITE + '/clients').then(function(result) {
                    return result.data;
                });
            }
        }
    }])

    .factory('preferentialProcurementsServ', ['$http', function($http) {
        return {
            findAll: function() {
                return $http.get(URL_SITE + '/preferential/procurements').then(function(result) {
                    return result.data;
                });
            }
//            create: function(formData) {
//                return $http.post(URL_SITE + '/products', formData, {
//                    headers: {'Content-Type': undefined },
//                    transformRequest: angular.identity
//                }).then(function(result) {
//                    //console.info('companiesServ', result.data);
//                    return result.data;
//                });
//            },
//            delete: function(product) {
//                return $http.delete(URL_SITE + '/products/' + product.id).then(function(result) {
//                    console.info('productsServ', 'delete', result.data);
//                    return result.data;
//                });
//            },
        }
    }])

    .factory('emailTemplatesServ', ['$http', function($http) {
        return {
            findAll: function() {
                return $http.get(URL_SITE + '/email/templates').then(function(result) {
                    return result.data;
                });
            },
            find: function(id) {
                return $http.get(URL_SITE + '/email/templates/' + id).then(function(result) {
                    return result.data;
                });
            },
            findPreview: function(subject, body) {
                //return $http.get(URL_SITE + '/email/templates/preview', {
                return $http.get(URL_SITE + '/emails/preview', {
                    params: {
                        subject: subject,
                        body: body
                    }
                }).then(function(result) {
                    return result.data;
                });
            },
            findVariables: function() {
                //return $http.get(URL_SITE + '/email/templates/preview', {
                return $http.get(URL_SITE + '/emails/variables').then(function(result) {
                    return result.data;
                });
            },
            create: function(formData) {
                return $http.post(URL_SITE + '/email/templates', formData, {
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).then(function(result) {
                    return result.data;
                });
            },
            update: function(id, formData) {
                return $http.post(URL_SITE + '/email/templates/' + id, formData, {
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).then(function(result) {
                    return result.data;
                });
            },
            delete: function(id) {
                return $http.delete(URL_SITE + '/email/templates/' + id).then(function(result) {
                    return result.data;
                });
            }
        }
    }])

    .factory('emailsServ', ['$http', function($http) {
        return {
            findAll: function() {
                return $http.get(URL_SITE + '/emails').then(function(result) {
                    return result.data;
                });
            },
            send: function(email_template, ids) {
                var formData = new FormData();
                formData.append('ids', ids);
                return $http.post(URL_SITE + '/emails/' + email_template.id, formData, {
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).then(function(result) {
                    return result.data;
                });
            }
        }
    }])


    .factory('remindersServ', ['$http', function($http) {
        return {
            findAll: function() {
                return $http.get(URL_SITE + '/email/reminders').then(function(result) {
                    return result.data;
                });
            },
            delete: function(ids) {
                var formData = new FormData();
                formData.append('ids', ids);
                return $http.post(URL_SITE + '/email/reminders', formData, {
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).then(function(result) {
                    return result.data;
                });
            }
        }
    }])

    .factory('certificatesServ', ['$http', function($http) {
        return {
            findNew: function() {
                return $http.get(URL_SITE + '/certificates/new').then(function(result) {
                    return result.data;
                });
            },
            findSoon: function() {
                return $http.get(URL_SITE + '/certificates/soon').then(function(result) {
                    return result.data;
                });
            },
            findExpired: function() {
                return $http.get(URL_SITE + '/certificates/expired').then(function(result) {
                    return result.data;
                });
            }
        }
    }])

    .factory('companiesServ', ['$http', function($http) {
        return {
            find: function(id) {
                return $http.get(URL_SITE + '/companies/' + id).then(function(result) {
                    return result.data;
                });
            }
        }
    }])
;
