require('../services/module')

module.exports = angular.module('app.taxsettings.controllers', ['app.taxsettings.services', 'ui.router'])
    .controller('TaxSettingsFormController', require('./TaxSettingsFormController'))
    .controller('ModalConflitoController', require('./ModalConflitoController'))
    .controller('TaxSettingsListController', require('./TaxSettingsListController'))
