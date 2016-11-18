define(['apiLocations'], function (APILocation) {


    MensagemService.$inject = ['GumgaRest'];
    function MensagemService(GumgaRest) {
        var service = new GumgaRest(APILocation.apiLocation + '/api/mensagem');
        service.getAttributeMessageNames = function(){
            return this.extend('get', '/attributemessagenames');
        };
        return service;
    }
    return MensagemService;
});