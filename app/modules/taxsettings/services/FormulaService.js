FormulaService.$inject = ['GumgaRest', 'apiLocation'];
function FormulaService(GumgaRest, apiLocation) {
    var service = new GumgaRest(apiLocation + '/api/formula');

    return service;
}
module.exports = FormulaService;