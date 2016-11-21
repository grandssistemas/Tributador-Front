angular.module('app.taxsettings.services')
        .service('MensagemService',['GumgaRest','apiLocation',
    function(GumgaRest,apiLocation) {
        var service = new GumgaRest(apiLocation + '/api/mensagem');
        service.getAttributeMessageNames = function(){
            return this.extend('get', '/attributemessagenames');
        };
        return service;  
}]);