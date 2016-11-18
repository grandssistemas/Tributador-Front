define(function (require) {

    var angular = require('angular');
    require('angular-ui-router');
    require('./services/module');
    require('./controllers/module');
    var APILocation = require('apiLocations');

    angular.module('app.taxsettings', ['ui.router', 'app.taxsettings.controllers', 'app.taxsettings.services'])
        .config(['$stateProvider',function ($stateProvider) {
            $stateProvider
                .state('taxsettings.list', {
                    url: '/list',
                    templateUrl: 'app/modules/taxsettings/views/list.html',
                    controller: 'TaxSettingsListController',
                    data: {                         id: 2                     }
                })
                .state('taxsettings.insert', {
                    url: '/insert',
                    templateUrl: 'app/modules/taxsettings/views/form.html',
                    controller: 'TaxSettingsFormController',
                    controllerAs: 'form',
                    data: {                         id: 3                     },                    resolve: {
                        entity: ['$stateParams', '$http', function ($stateParams, $http) {
                            var url = APILocation.apiLocation + '/api/taxationgroup/new';
                            return $http.get(url);
                        }]
                    }
                })
                .state('taxsettings.edit', {
                    url: '/edit/:id',
                    templateUrl: 'app/modules/taxsettings/views/form.html',
                    controller: 'TaxSettingsFormController',
                    data: {                         id: 3                     },                    resolve: {
                        entity: ['$stateParams', '$http', function ($stateParams, $http) {
                            var url = APILocation.apiLocation + '/api/taxationgroup/' + $stateParams.id;
                            return $http.get(url);
                        }]
                    }
                });
        }])
});
