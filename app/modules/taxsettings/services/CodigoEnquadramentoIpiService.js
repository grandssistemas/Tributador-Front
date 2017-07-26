CodigoEnquadramentoIpiService.$inject = ['GumgaRest', 'apiLocation'];
function CodigoEnquadramentoIpiService(GumgaRest, apiLocation) {
    var service = new GumgaRest(apiLocation + '/api/codigoenquadramentoipi');
    return service;
}
module.exports = CodigoEnquadramentoIpiService;