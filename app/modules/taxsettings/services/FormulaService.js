angular.module('app.taxsettings.services')
    .service('FormulaService', ['GumgaRest','apiLocation',function(GumgaRest,apiLocation){
        var service = new GumgaRest(apiLocation + '/api/formula');

        return service;
    }]);