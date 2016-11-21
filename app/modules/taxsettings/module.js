    angular.module('app.taxsettings', ['ui.router', 'app.taxsettings.controllers', 'app.taxsettings.services','api.location'])
        .config(['$stateProvider','apiLocation',function ($stateProvider,apiLocation) {
            $stateProvider
                .state('taxsettings.list', {
                    url: '/list',
                    templateUrl: 'modules/taxsettings/views/list.html',
                    controller: 'TaxSettingsListController',
                    data: {                         id: 2                     }
                })
                .state('taxsettings.insert', {
                    url: '/insert',
                    templateUrl: 'modules/taxsettings/views/form.html',
                    controller: 'TaxSettingsFormController',
                    controllerAs: 'form',
                    data: {                         id: 3                     },                    resolve: {
                        entity: ['$stateParams', '$http', function ($stateParams, $http) {
                            var url = apiLocation + '/api/taxationgroup/new';
                            return $http.get(url);
                        }]
                    }
                })
                .state('taxsettings.edit', {
                    url: '/edit/:id',
                    templateUrl: 'modules/taxsettings/views/form.html',
                    controller: 'TaxSettingsFormController',
                    data: {                         id: 3                     },                    resolve: {
                        entity: ['$stateParams', '$http', function ($stateParams, $http) {
                            var url = apiLocation + '/api/taxationgroup/' + $stateParams.id;
                            return $http.get(url);
                        }]
                    }
                });
        }])

