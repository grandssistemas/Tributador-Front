angular.module('app.taxsettings.services')
        .service('MensagemService',['GumgaRest','apiLocation',
    function(GumgaRest,apiLocation) {
        const service = new GumgaRest(apiLocation + '/api/mensagem');

        service.getAttributeMessageNames = () => {
            return service.extend('get', '/attributemessagenames');
        };

        service.getTiposMensagem = () => {
            return service.extend('get', '/tiposmensagem');
        };

        return service;  
}]);