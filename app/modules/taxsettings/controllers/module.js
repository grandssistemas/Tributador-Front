define(function (require) {
    var angular = require('angular');

    require('../services/module');
    require('angular-ui-router');

    return angular.module('app.taxsettings.controllers', ['app.taxsettings.services','ui.router'])
        .controller('TaxSettingsFormController', require('./TaxSettingsFormController'))
        .controller('TaxSettingsListController', require('./TaxSettingsListController'))
        .controller('ModalConflitoController', require('./ModalConflitoController'));
});
