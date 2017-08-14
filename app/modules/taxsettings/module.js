require('./controllers/module');
require('./services/module');

let list = require('./views/list.html');
let form = require('./views/form.html');


module.exports = angular.module('app.taxsettings', ['ui.router', 'app.taxsettings.controllers', 'app.taxsettings.services', 'api.location'])
    .config(['$stateProvider', 'apiLocation', function ($stateProvider, apiLocation) {
        $stateProvider
            .state('taxsettings.list', {
                url: '/list',
                templateUrl: list,
                controller: 'TaxSettingsListController',
                data: {id: 2}
            })
            .state('taxsettings.insert', {
                url: '/insert',
                templateUrl: form,
                controller: 'TaxSettingsFormController',
                controllerAs: 'form',
                data: {id: 3}, resolve: {
                    entity: ['$stateParams', '$http', 'TaxationGroupService', '$q', function ($stateParams, $http, TaxationGroupService, $q) {
                        var url = apiLocation + '/api/taxationgroup/new';
                        if(TaxationGroupService.newEntity){
                            return $q(function(resolve){
                                var ent = angular.copy(TaxationGroupService.newEntity);
                                delete TaxationGroupService.newEntity;
                                resolve({data: ent});
                            });
                        };
                        return $http.get(url);
                    }]
                }
            })
            .state('taxsettings.edit', {
                url: '/edit/:id',
                templateUrl: form,
                controller: 'TaxSettingsFormController',
                data: {id: 3}, resolve: {
                    entity: ['$stateParams', '$http', function ($stateParams, $http) {
                        var url = apiLocation + '/api/taxationgroup/' + $stateParams.id;
                        return $http.get(url);
                    }]
                }
            });
    }])

