angular.module('taxsettings.core', [
    'ui.router'
    , 'ngSanitize'
    , 'gumga.core'
    , 'brasil.filters'
    , 'ui.utils.masks'
    , 'datePicker'
    , 'app.stock'
    , 'taxsettings.core'
    , 'buddy.core'
    , 'operationtype.core'
    , 'product.core'
    //FIMINJECTIONS
])
    .config(function ($stateProvider) {
        $stateProvider
            .state('taxsettings', {
                    data: {
                        id: 1
                    },
                    url: '/taxsettings',
                    templateUrl: 'app/modules/taxsettings/views/base.html'
                })
    });