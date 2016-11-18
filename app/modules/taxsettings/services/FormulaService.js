define(['apiLocations'], function (APILocation) {

    FormulaService.$inject = ['GumgaRest'];
    function FormulaService(GumgaRest) {
        var service = new GumgaRest(APILocation.apiLocation + '/api/formula');

        return service;
    }

    return FormulaService;
});