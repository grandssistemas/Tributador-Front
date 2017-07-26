MensagemService.$inject = ['GumgaRest', 'apiLocation'];
function MensagemService(GumgaRest, apiLocation) {
    const service = new GumgaRest(apiLocation + '/api/mensagem');

    service.getAttributeMessageNames = () => {
        return service.extend('get', '/attributemessagenames');
    };

    service.getTiposMensagem = () => {
        return service.extend('get', '/tiposmensagem');
    };

    return service;
}
module.exports = MensagemService