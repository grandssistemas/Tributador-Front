define(function(require){
    var angular =  require('angular');
    return angular.module('app.taxsettings.services',[])
        .service('TaxationGroupService',require('./TaxationGroupService'))
        .service('FormulaService',require('./FormulaService'))
        .service('MensagemService',require('./MensagemService'));
});