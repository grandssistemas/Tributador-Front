angular.module('app.taxsettings.services')
    .service('TaxationGroupService', ['GumgaRest','apiLocation',function(GumgaRest,apiLocation){
var service = new GumgaRest(apiLocation + '/api/taxationgroup');

        service.saveValiding = function (entity) {
            if(!entity.id) {
                return this.extend('post', '/validatesave',entity);
            }
            return this.extend('put', '/validatesave',entity);
        };
        service.getStateList = function () {
            return this.extend('get', '/state')
        };

        service.getICMSTypes = function () {
            return this.extend('get', '/icmscst')
        };

        service.getCsosnTypes = function () {
            return this.extend('get', '/csosntypes')
        };

        service.getIPITypes = function () {
            return this.extend('get', '/ipicst');
        };

        service.getPISTypes = function () {
            return this.extend('get', '/piscst');
        };

        service.getCalculationTypes = function () {
            return this.extend('get', '/calculationtype');
        };

        service.getModeCalculationBaseTypes = function () {
            return this.extend('get', '/modecalculationbase')
        };

        service.getModeCalculationBaseSTTypes = function () {
            return this.extend('get', '/modecalculationbasest')
        };

        service.getUnburdeningMotives = function () {
            return this.extend('get', '/unburdeningmotive')
        };

        service.getCofinsPisTypes = function () {
            return this.extend('get', '/cofinscst')
        };

        return service;
    }]);