require('./import-style');
require('./import-modules');

let base = require('./baseTributador.html');

module.exports = angular.module('taxsettings.core', [
    'ui.router',
    'ngSanitize',
    'gumga.core',
    'brasil.filters',
    'ui.utils.masks',
    'datePicker',
    'app.stock',
    'app.taxsettings',
    'buddy.core',
    'operationtype.core',
    'product.core'
    //FIMINJECTIONS
])
    .config(function ($stateProvider) {
        $stateProvider
            .state('taxsettings', {
                data: {
                    id: 1
                },
                url: '/taxsettings',
                templateUrl: base
            })
    });