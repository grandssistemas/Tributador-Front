module.exports = angular.module('app.taxsettings.services', ['api.location'])
    .service('MensagemService', require('./MensagemService'))
    .service('FormulaService', require('./FormulaService'))
    .service('CodigoEnquadramentoIpiService', require('./CodigoEnquadramentoIpiService'))
    .service('TaxationGroupService', require('./TaxationGroupService'));