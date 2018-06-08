FormulaService.$inject = ['GumgaRest', 'apiLocation'];
function FormulaService(GumgaRest, apiLocation) {
    var service = new GumgaRest(apiLocation + '/api/formula');

    service.copyRecord = function (id) {
        return this.extend('post', '/copyrecord/' + id);
    };
    service.deleteRecord = function (id) {
        return this.extend('delete', '/deleterecord/' + id);
    };

    return service;
}
module.exports = FormulaService;