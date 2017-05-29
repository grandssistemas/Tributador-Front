angular.module('app.taxsettings.services')
    .service('CodigoEnquadramentoIpiService', ['GumgaRest','apiLocation',function (GumgaRest,apiLocation) {
        var service = new GumgaRest(apiLocation + '/api/codigoenquadramentoipi');
        return service;
    }]);
