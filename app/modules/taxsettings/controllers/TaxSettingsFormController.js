let modalConflito = require('../views/modalConflito.html');

TaxSettingsFormController.$inject = [
    'TaxationGroupService',
    'MensagemService',
    'CompanyService',
    'OperationTypeService',
    'PersonGroupService',
    'ProductGroupService',
    'CfopService',
    'FormulaService',
    '$state',
    'entity',
    '$scope',
    '$timeout',
    '$uibModal',
    '$rootScope',
    'CodigoEnquadramentoIpiService',
    'GumgaAlert',
    'gumgaController'];
function TaxSettingsFormController(TaxationGroupService,
                                   MensagemService,
                                   CompanyService,
                                   OperationTypeService,
                                   PersonGroupService,
                                   ProductGroupService,
                                   CfopService,
                                   FormulaService,
                                   $state,
                                   entity,
                                   $scope,
                                   $timeout,
                                   $uibModal,
                                   $rootScope,
                                   CodigoEnquadramentoIpiService,
                                   GumgaAlert,
                                   gumgaController) {

    gumgaController.createRestMethods($scope, TaxationGroupService, 'taxationGroup');
    $scope.taxationGroup.execute('reset');
    $scope.entity = angular.copy(entity.data);
    $scope.pis = $scope.entity.taxationPIS || {};
    $scope.icms = $scope.entity.taxationICMS || {};
    $scope.cofins = $scope.entity.taxationCOFINS || {};
    $scope.ipi = $scope.entity.taxationIPI || {};
    $scope.continue = {};
    $scope.entity.operationTypes = $scope.entity.operationTypes || [];
    $scope.entity.origins = $scope.entity.origins || [];
    $scope.entity.destinations = $scope.entity.destinations || [];
    $scope.entity.personGroups = $scope.entity.personGroups || [];
    $scope.entity.productGroups = $scope.entity.productGroups || [];
    $scope.vICMSd = $scope.vICMSd || 0;
    $scope.showICMS = false;
    $scope.showPIS = false;
    $scope.showCOFINS = false;
    $scope.openTaxation = false;
    $scope.step1 = false;
    $scope.configOpen = false;
    $scope.configOpenNext = false;
    $scope.mensagemICMSList = [];
    $scope.mensagemPISList = [];
    $scope.mensagemIPIList = [];
    $scope.mensagemCOFINSList = [];
    $scope.formulaIcmsBCList = [];
    $scope.formulaValorIcms = [];
    $scope.formulaBaseIcmsSt = [];
    $scope.formulaValorIcmsSt = [];
    $scope.formulaValorIcmsDeson = [];
    $scope.formulaIcmsStDeson = [];
    $scope.fomulasBaseIcmsRet = [];
    $scope.formulaValorIcmsRet = [];
    $scope.formulaBaseIcmsDest = [];
    $scope.formulaValorIcmsDest = [];
    $scope.formulaValorIcmsOpe = [];
    $scope.formulaBasePis = [];
    $scope.formulaBasePisST = [];
    $scope.formulaValorPisST = [];
    $scope.formulaValorPis = [];
    $scope.formulaBaseCofins = [];
    $scope.formulaBaseCofinsST = [];
    $scope.formulaValorCofinsST = [];
    $scope.formulaValorCofins = [];
    $scope.cfopList = [];
    $scope.stateOriginConflicts = [];
    $scope.stateDestinationsConflicts = [];
    $scope.personGroupConflicts = [];
    $scope.productGroupConflicts = [];
    $scope.operationConflicts = [];
    if ($scope.entity.id) {
        $scope.openTaxation = true;
        $scope.configOpen = false;
        $scope.configOpenNext = false;
    }

    CompanyService.getCurrentCompany().then(function (data) {
        $scope.icmsNormal = data.data.crt === 'REGIME_NORMAL';
        if ($scope.icmsNormal) {
            $scope.tribute = ['ICMS', 'PIS', 'COFINS', 'IPI'];
        } else {
            $scope.tribute = ['ICMS Simples', 'PIS', 'COFINS', 'IPI'];
            $scope.icms.CST = '';
        }
    });

    OperationTypeService.all().then(function (data) {
        $scope.operationTypesList = data.data.values;
        $timeout(function () {
            $scope.entity.operationTypes = entity.data.operationTypes || [];
            $scope.entity.operationTypes = $scope.entity.operationTypes.map(function (data) {
                return $scope.operationTypesList.filter(function (value) {
                    return value.id === data.id;
                })[0];
            })
        });
    });

    $scope.clearPage = function() {
        $scope.pis = {};
        $scope.icms = {};
        $scope.cofins = {};
        $scope.ipi = {};
        $scope.entity.operationTypes = [];
        $scope.entity.origins = [];
        $scope.entity.destinations = [];
        $scope.entity.personGroups = [];
        $scope.entity.productGroups = [];
        $scope.entity.name = "";
        $scope.openTaxation = false;
        $scope.openPanel();
        $scope.stateOriginConflicts = [];
        $scope.personGroupConflicts = [];
        $scope.productGroupConflicts = [];
        $scope.operationConflicts = [];
        $scope.entity.taxationPIS = {};
        $scope.entity.taxationICMS = {};
        $scope.entity.taxationCOFINS = {};
        $scope.entity.taxationIPI = {};
    };

    $scope.replicateTaxSetting = function(){
        var newEntity = angular.copy($scope.entity);
        delete newEntity.id;

        TaxationGroupService.newEntity = newEntity;
        $state.go('taxsettings.insert');
    };

    PersonGroupService.all().then(function (data) {
        $scope.personGroupList = data.data.values;
        $timeout(function () {
            $scope.entity.personGroups = entity.data.personGroups || [];
        })
    });
    ProductGroupService.all().then(function (data) {
        $scope.productGroupList = data.data.values;
        $timeout(function () {
            $scope.entity.productGroups = entity.data.productGroups || [];
        })
    });
    TaxationGroupService.getStateList().then(function (data) {
        $scope.stateDestinationList = $scope.stateOriginList = data.data;
        $timeout(function () {
            $scope.entity.origins = unmapEnum(entity.data.origins, $scope.stateOriginList);
            $scope.entity.destinations = unmapEnum(entity.data.destinations, $scope.stateDestinationList);
        })
    });
    TaxationGroupService.getICMSTypes().then(function (data) {
        $scope.icmsTypes = [{label: ' '}].concat(data.data);
    });
    TaxationGroupService.getCsosnTypes().then(function (data) {
        $scope.csosnTypes = [{label: ' '}].concat(data.data);
    });
    TaxationGroupService.getPISTypes().then(function (data) {
        $scope.cstpis = [{label: ' '}].concat(data.data);
    });
    TaxationGroupService.getIPITypes().then(function (data) {
        $scope.cstipi = [{label: ' '}].concat(data.data);
    });
    TaxationGroupService.getCalculationTypes().then(function (data) {
        $scope.calculationTypes = data.data;
    });
    TaxationGroupService.getModeCalculationBaseTypes().then(function (data) {
        $scope.modeCalculationBaseList = [{label: ' '}].concat(data.data);
    });
    TaxationGroupService.getModeCalculationBaseSTTypes().then(function (data) {
        $scope.modeCalculationBaseSTList = [{label: ' '}].concat(data.data);
    });
    TaxationGroupService.getUnburdeningMotives().then(function (data) {
        $scope.unburdeningMotiveList = [{label: ' '}].concat(data.data);
    });
    $scope.confOperation = {
        columns: 'operations',
        selection: 'multi',
        conditional: operationConditional,
        checkbox: true,
        columnsConfig: [
            {
                name: 'operations',
                size: 'col-md-9',
                title: '<strong gumga-translate-tag="taxsettings.operations">Operations</strong>',
                content: '<div>{{$value.name}}</div>'
            }
        ]
    };
    $scope.confState = {
        columns: 'state',
        selection: 'multi',
        checkbox: true,
        columnsConfig: [
            {
                name: 'state',
                size: 'col-md-9',
                title: '<strong gumga-translate-tag="taxsettings.state">State</strong>',
                content: '<div>{{$value.label}}</div>'
            }
        ]
    };
    $scope.confPerson = {
        columns: 'person',
        selection: 'multi',
        checkbox: true,
        columnsConfig: [
            {
                name: 'person',
                size: 'col-md-9',
                title: '<strong gumga-translate-tag="taxsettings.groupofpeople">Group of People</strong>',
                content: '<div>{{$value.name}}</div>'
            }
        ]
    };
    $scope.confProduct = {
        columns: 'product',
        selection: 'multi',
        checkbox: true,
        columnsConfig: [
            {
                name: 'product',
                size: 'col-md-9',
                title: '<strong gumga-translate-tag="taxsettings.productgroup">Product Group</strong>',
                content: '<div>{{$value.name}}</div>'
            }
        ]
    };
    $scope.openPanel = function (panel) {
        $scope.configOpen = (panel === 'configOpen');
        $scope.openTaxation = (panel === 'openTaxation');
    };

    if (!$scope.entity.id) {
        $scope.openPanel('configOpen');
    }

    $scope.blockBtnTributos = function (entity) {
        return entity.operationTypes.length === 0 ||
            entity.origins.length === 0 ||
            entity.destinations.length === 0 ||
            entity.personGroups.length === 0 ||
            entity.productGroups.length === 0;
    };
    $scope.isIcmsAble = function (entity) {
        return !entity.CST ||
            entity.CST === 'ISENTA_COM_ST_30' ||
            entity.CST === 'NAO_TRIBUTADA_41_ICMSST' ||
            entity.CST === 'COBRADO_ANTERIORMENTE_POR_ST_60';
    };
    $scope.isIcmsStandartGroupAble = function (entity) {
        return entity.CST === 'INTEGRALMENTE_00' ||
            entity.CST === 'COBRANCA_ST_10' ||
            entity.CST === 'COBRANCA_ST_10_COM_PARTILHA' ||
            entity.CST === 'REDUCAO_BC_20' ||
            entity.CST === 'DIFERIMENTO_51' ||
            entity.CST === 'ST_REDUCAO_BC_70' ||
            entity.CST === 'OUTRAS_COM_PARTILHA_90' ||
            entity.CST === 'OUTROS_90';
    };
    $scope.isIcmsDesoGroupAble = function (entity) {
        return entity.CST === 'REDUCAO_BC_20' ||
            entity.CST === 'ISENTA_40' ||
            entity.CST === 'NAO_TRIBUTADA_41' ||
            entity.CST === 'SUSPENSAO_50' ||
            entity.CST === 'ST_REDUCAO_BC_70' ||
            entity.CST === 'OUTROS_90';
    };
    $scope.isIcmsRedGroupAble = function (entity) {
        return entity.CST === 'COBRANCA_ST_10_COM_PARTILHA' ||
            entity.CST === 'REDUCAO_BC_20' ||
            entity.CST === 'DIFERIMENTO_51' ||
            entity.CST === 'ST_REDUCAO_BC_70' ||
            entity.CST === 'OUTRAS_COM_PARTILHA_90' ||
            entity.CST === 'OUTROS_90';
    };
    $scope.isIcmsStAble = function (entity) {
        return !entity.CST ||
            entity.CST === 'INTEGRALMENTE_00' ||
            entity.CST === 'REDUCAO_BC_20' ||
            entity.CST === 'ISENTA_40' ||
            entity.CST === 'NAO_TRIBUTADA_41' ||
            entity.CST === 'SUSPENSAO_50' ||
            entity.CST === 'DIFERIMENTO_51';
    };
    $scope.isIcmsStStandartGroupAble = function (entity) {
        return entity.CST === 'NAO_TRIBUTADA_41_ICMSST' || entity.CST === 'COBRADO_ANTERIORMENTE_POR_ST_60';
    };
    $scope.getCfopIcms = function (value) {
        value = value || '';
        return CfopService.getAdvancedSearch('lower(obj.codigo) like lower(\'%' + value + '%\') or lower(obj.descricao) like lower(\'%' + value + '%\')').then(function (data) {
            return data.data.values;
        });
    };
    $scope.getFormulaIcms = function (value) {
        return FormulaService.getAdvancedSearch('lower(obj.name) like lower(\'%' + value + "%') and obj.tariffType = 'ICMS'").then(function (data) {
            return data.data.values;
        });
    };
    $scope.getFormulaPis = function (value) {
        return FormulaService.getAdvancedSearch('lower(obj.name) like lower(\'%' + value + "%\') and obj.tariffType = 'PIS'").then(function (data) {
            return data.data.values;
        });
    };
    $scope.getFormulaCofins = function (value) {
        return FormulaService.getAdvancedSearch('lower(obj.name) like lower(\'%' + value + "%\') and obj.tariffType = 'COFINS'").then(function (data) {
            return data.data.values;
        });
    };
    $scope.getFormulaIpi = function (value) {
        return FormulaService.getAdvancedSearch('lower(obj.name) like lower(\'%' + value + "%') and obj.tariffType = 'IPI'").then(function (data) {
            return data.data.values;
        });
    };
    $scope.getMensagem = function (value, tribute) {
        return MensagemService.getAdvancedSearch('lower(obj.name) like lower(\'%' + value + "%') and obj.tariffType = '" + tribute+"'").then(function (data) {
            return data.data.values;
        });
    };
    $scope.isIpiAble = function (entity) {
        return !entity.CST ||
            (entity.CST !== 'ENTRADA_RECUPERACAO_CREDITO_00' &&
            entity.CST !== 'OUTRAS_ENTRADAS_49' &&
            entity.CST !== 'SAIDA_TRIBUTADA_50' &&
            entity.CST !== 'OUTRAS_SAIDAS_99');
    };
    $scope.isPisAble = function (entity) {
        return !entity.CST ||
            entity.CST === 'OPERACAO_TRIBUTAVEL_04' ||
            entity.CST === 'OPERACAO_TRIBUTAVEL_03' ||
            entity.CST === 'OPERACAO_TRIBUTAVEL_06' ||
            entity.CST === 'OPERACAO_TRIBUTAVEL_07' ||
            entity.CST === 'SEM_INCIDENCIA_08' ||
            entity.CST === 'COM_SUSPENSAO_09';
    };
    $scope.isPisOperationTypeUnable = function (entity) {
        return entity.CST &&
            ($scope.isPisAble(entity) ||
            entity.CST === 'OPERACAO_TRIBUTAVEL_01' ||
            entity.CST === 'OPERACAO_TRIBUTAVEL_02');
    };
    $scope.isPisAliquotaAble = function (entity) {
        return $scope.isPisOperationTypeUnable(entity) ||
            entity.calculationType === 'PORCENTAGEM';
    };
    $scope.isCofinsAble = function (entity) {
        return !entity.CST ||
            entity.CST === 'OPERACAO_TRIBUTAVEL_04' ||
            entity.CST === 'OPERACAO_TRIBUTAVEL_03' ||
            entity.CST === 'OPERACAO_TRIBUTAVEL_06' ||
            entity.CST === 'OPERACAO_TRIBUTAVEL_07' ||
            entity.CST === 'SEM_INCIDENCIA_08' ||
            entity.CST === 'COM_SUSPENSAO_09';
    };
    $scope.isCofinsOperationTypeUnable = function (entity) {
        return entity.CST &&
            ($scope.isCofinsAble(entity) ||
            entity.CST === 'OPERACAO_TRIBUTAVEL_01' ||
            entity.CST === 'OPERACAO_TRIBUTAVEL_02');
    };
    $scope.isCofinsAliquotaAble = function (entity) {
        return $scope.isCofinsOperationTypeUnable(entity) || entity.calculationType === 'PORCENTAGEM';
    };

    function invalidPis(pis) {
        if (pis.CST) {
            switch (pis.CST) {
                case 'OPERACAO_TRIBUTAVEL_01':
                case 'OPERACAO_TRIBUTAVEL_02':
                    if (invalidPisAliquota(pis)) {
                        return true;
                    }
                    break;
                case 'OPERACAO_TRIBUTAVEL_05':
                    if (!pis.calculationTypeST) {
                        return true;
                    }
                    if (pis.calculationTypeST === 'PORCENTAGEM' && invalidPisAliquotaST(pis)) {
                        return true;
                    }
                    break;
                case 'OUTRAS_SAIDAS_49':
                case 'OPERACOES_CREDITO_50':
                case 'OPERACOES_CREDITO_51':
                case 'OPERACOES_CREDITO_52':
                case 'OPERACOES_CREDITO_53':
                case 'OPERACOES_CREDITO_54':
                case 'OPERACOES_CREDITO_55':
                case 'OPERACOES_CREDITO_56':
                case 'CREDITO_PRESUMIDO_60':
                case 'CREDITO_PRESUMIDO_61':
                case 'CREDITO_PRESUMIDO_62':
                case 'CREDITO_PRESUMIDO_63':
                case 'CREDITO_PRESUMIDO_64':
                case 'CREDITO_PRESUMIDO_65':
                case 'CREDITO_PRESUMIDO_66':
                case 'CREDITO_PRESUMIDO_67':
                case 'AQUISICAO_SEM_CREDITO_70':
                case 'AQUISICAO_ISENTA_71':
                case 'AQUISICAO_COM_SUSPENSAO_72':
                case 'AQUISICAO_ALIQUOTA_ZERO_73':
                case 'AQUISICAO_SEM_CONTRIBUICAO_74':
                case 'AQUISICAO_ST_75':
                case 'OUTRAS_ENTRADAS_98':
                case 'OUTRAS_99':
                    if (!pis.calculationType) {
                        return true;
                    }
                    if (pis.calculationType === 'PORCENTAGEM' && invalidPisAliquota(pis)) {
                        return true;
                    }
                    break;
                default:

            }
        }
    }

    function invalidCofins(cofins) {
        if (cofins.CST) {
            switch (cofins.CST) {
                case 'OPERACAO_TRIBUTAVEL_01':
                case 'OPERACAO_TRIBUTAVEL_02':
                    if (invalidCofinsAliquota(cofins)) {
                        return true;
                    }
                    break;
                case 'OPERACAO_TRIBUTAVEL_05':
                    if (!cofins.calculationTypeST) {
                        return true;
                    }
                    if (cofins.calculationTypeST === 'PORCENTAGEM' && invalidCofinsAliquotaST(cofins)) {
                        return true;
                    }
                    break;
                case 'OUTRAS_SAIDAS_49':
                case 'OPERACOES_CREDITO_50':
                case 'OPERACOES_CREDITO_51':
                case 'OPERACOES_CREDITO_52':
                case 'OPERACOES_CREDITO_53':
                case 'OPERACOES_CREDITO_54':
                case 'OPERACOES_CREDITO_55':
                case 'OPERACOES_CREDITO_56':
                case 'CREDITO_PRESUMIDO_60':
                case 'CREDITO_PRESUMIDO_61':
                case 'CREDITO_PRESUMIDO_62':
                case 'CREDITO_PRESUMIDO_63':
                case 'CREDITO_PRESUMIDO_64':
                case 'CREDITO_PRESUMIDO_65':
                case 'CREDITO_PRESUMIDO_66':
                case 'CREDITO_PRESUMIDO_67':
                case 'AQUISICAO_SEM_CREDITO_70':
                case 'AQUISICAO_ISENTA_71':
                case 'AQUISICAO_COM_SUSPENSAO_72':
                case 'AQUISICAO_ALIQUOTA_ZERO_73':
                case 'AQUISICAO_SEM_CONTRIBUICAO_74':
                case 'AQUISICAO_ST_75':
                case 'OUTRAS_ENTRADAS_98':
                case 'OUTRAS_99':
                    if (!cofins.calculationType) {
                        return true;
                    }
                    if (cofins.calculationType === 'PORCENTAGEM' && invalidCofinsAliquota(cofins)) {
                        return true;
                    }
                    break;
                default:
                    break;
            }
        }

    }

    function invalidIpi(ipi) {
        if (ipi.CST) {
            switch (ipi.CST) {
                case 'ENTRADA_RECUPERACAO_CREDITO_00':
                case 'OUTRAS_ENTRADAS_49':
                case 'SAIDA_TRIBUTADA_50':
                case 'OUTRAS_SAIDAS_99':
                    if (!ipi.ipiCalculationType || (ipi.ipiCalculationType === 'PORCENTAGEM' && invalidIpiAliquota(ipi))) {
                        return true;
                    }
                    break;
                default:
                    break;
            }
        }
    }

    function invalidIcmsNormal(icms) {
        if (icms.CST) {
            switch (icms.CST) {
                case 'INTEGRALMENTE_00':
                    if (invalidIcmsBase(icms)) {
                        return true;
                    }
                    break;
                case 'COBRANCA_ST_10':
                    if (invalidIcmsBase(icms) || invalidIcmsStBase(icms)) {
                        return true;
                    }
                    break;
                case 'OUTRAS_COM_PARTILHA_90':
                case 'COBRANCA_ST_10_COM_PARTILHA':
                    if (invalidIcmsBase(icms) || invalidIcmsStBase(icms) || !icms.UFST) {
                        return true;
                    }
                    break;
                case 'REDUCAO_BC_20':
                    if (invalidIcmsBase(icms) || invalidIcmsDeson(icms)) {
                        return true;
                    }
                    break;
                case 'ISENTA_COM_ST_30':
                    if (invalidIcmsStBase(icms) || invalidIcmsDeson(icms)) {
                        return true;
                    }
                    break;
                case 'ISENTA_40':
                case 'NAO_TRIBUTADA_41':
                case 'SUSPENSAO_50':
                    if (invalidIcmsDeson(icms)) {
                        return true;
                    }
                    break;
                case 'NAO_TRIBUTADA_41_ICMSST':
                    if (invalidIcmsStRetid(icms)) {
                        return true;
                    }
                    break;
                case 'DIFERIMENTO_51':
                    if (invalidIcmsBase(icms) || invalidIcmsDife(icms)) {
                        return true;
                    }
                    break;
                case 'COBRADO_ANTERIORMENTE_POR_ST_60':
                    if (invalidIcmsStRetidoAnter(icms)) {
                        return true;
                    }
                    break;
                case 'ST_REDUCAO_BC_70':
                case 'OUTROS_90':
                    if (invalidIcmsBase(icms) || invalidIcmsDeson(icms) || invalidIcmsStBase(icms)) {
                        return true;
                    }
                    break;
                default:
            }
        }
    }

    function invalidIcmsSimples(icms) {
        if (icms.CSOSN) {
            switch (icms.CSOSN) {
                case 'CREDITO_101':
                    if (icms.vCredICMSSN == null) {
                        return true
                    }
                    break;
                case 'CREDITO_COM_ST_201':
                    if (invalidBaseStSimples(icms) || invalidAliquotaGroup(icms)) {
                        return true;
                    }
                    break;
                case 'SEM_CREDITO_COM_ST_202':
                case 'RECEITA_BRUTA_COM_ST_203':
                    if (invalidBaseStSimples(icms)) {
                        return true;
                    }
                    break;
                case 'ANTECIPACAO_ST_500':
                    if (invalidIcmsStRetidoAnterSimples(icms)) {
                        return true
                    }
                    break;
                case 'OUTROS_900':
                    if (invalidBaseStSimples(icms) || invalidAliquotaGroup(icms) || invalidIcmsBase(icms)) {
                        return true;
                    }
                    break;
                default:
                    break;

            }
        }
    }

    function invalidIcmsStRetidoAnterSimples(icms) {
        return (icms.vBCSTRet && !icms.vICMSSTRet) || (!icms.vBCSTRet && icms.vICMSSTRet);
    }
entity
    function invalidBaseStSimples(icms) {
        return !icms.modBCST || !icms.vBCST || (icms.pICMSST == null) || !icms.vICMSST;
    }

    function invalidAliquotaGroup(icms) {
        return icms.pCredSN == null || icms.vCredICMSSN == null;
    }


    $scope.saveDisabled = function (entity, icms, pis, cofins, ipi) {
        return (($scope.icmsNormal && invalidIcmsNormal(icms)) ||
        (!$scope.icmsNormal && invalidIcmsSimples(icms)) ||
        invalidPis(pis) ||
        invalidCofins(cofins) ||
        invalidIpi(ipi) ||
            (entity.name && entity.name.length === 0));
    };
    $scope.update = function (entity, icms, pis, cofins, ipi, disabled) {
        if (disabled) {
            return;
        }
        entity.destinations = entity.destinations.map(mapEnum);
        entity.origins = entity.origins.map(mapEnum);
        delete entity.taxationIPI;
        delete entity.taxationPIS;
        delete entity.taxationCOFINS;
        delete entity.taxationICMS;
        ipi = angular.copy(ipi);
        icms = angular.copy(icms);
        pis = angular.copy(pis);
        cofins = angular.copy(cofins);
        if (ipi.CST) {
            entity.taxationIPI = mountIpi(ipi);
        }
        if ($scope.icmsNormal && icms.CST) {
            entity.taxationICMS = mountIcms(icms);
        } else if (!$scope.icmsNormal && icms.CSOSN) {
            entity.taxationICMS = mountIcmsSimples(icms);
        }
        if (entity.taxationICMS && $scope.isFCPVisible(entity.taxationICMS)) {
            entity.taxationICMS.pICMSUFDest = icms.pICMSUFDest;
            entity.taxationICMS.pFCPUFDest = icms.pFCPUFDest;
        }
        if (pis.CST) {
            entity.taxationPIS = mountPis(pis);
        }
        if (cofins.CST) {
            entity.taxationCOFINS = mountCofins(cofins);
        }
        $rootScope.$emit('hideNextErrorMessage');
        TaxationGroupService.saveValiding(entity).then(doSave, doErr)
    };

    function doSave() {
        if($state.current.name === "taxsettings.insert"){
            swal({
                    title: "Confirmação",
                    text: "Deseja continuar inserindo?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Continuar",
                    cancelButtonText: "Não",
                    closeOnConfirm: true,
                    closeOnCancel: true
                },
                function(isConfirm) {
                    if (!isConfirm) {
                        $state.go('taxsettings.list');
                    }
                });
        }else{
            $state.go('taxsettings.list');
        };
    }

    function doErr(err) {
        if (Array.isArray(err.data)) {
            var values = err.data.map(function (data) {
                data.destinations = unmapEnum(data.destinations, $scope.stateDestinationList);
                data.origins = unmapEnum(data.origins, $scope.stateOriginList);
                return data;
            });
            $uibModal.open({
                size: 'lg',
                templateUrl: modalConflito,
                controller: 'ModalConflitoController',
                resolve: {
                    values: function () {
                        return values;
                    },
                    entity: function () {
                        return $scope.entity;
                    }
                }
            });
        } else {
            GumgaAlert.createWarningMessage('Tributação Incorreta', err.data.details);
        }
    }

    function unmapEnum(valueArr, dtoArr) {
        valueArr = valueArr || [];
        return valueArr.map(function (data) {
            return dtoArr.filter(function (value) {
                return value.key === data || value.key === data.key;
            })[0]
        });
    }

    function invalidCofinsAliquotaST(cofins) {
        return !cofins.vBCST || cofins.pCOFINSST == null || !cofins.vCOFINSST;
    }

    function invalidCofinsAliquota(cofins) {
        return !cofins.vBC || cofins.pCOFINS == null || !cofins.vCOFINS;
    }

    function invalidIpiAliquota(ipi) {
        return !ipi.vBC || ipi.pIPI == null || !ipi.vIPI;
    }

    function invalidPisAliquotaST(pis) {
        return !pis.vBCST || pis.pPISST == null || !pis.vPISST;
    }

    function invalidPisAliquota(pis) {
        return !pis.vBC || pis.pPIS == null || !pis.vPIS;
    }

    function invalidIcmsBase(icms) {
        return !icms.modBC || !icms.vBC || (icms.pICMS == null) || !icms.vICMS;
    }

    function invalidIcmsDeson(icms) {
        return (icms.vICMSDeson && !icms.motDesICMS) || (!icms.vICMSDeson && icms.motDesICMS);
    }

    function invalidIcmsStBase(icms) {
        return !icms.modBCST || !icms.pRedBCST || (icms.pMVAST == null) || !icms.vBCST || (icms.pICMSST == null) || !icms.vICMSST;
    }

    function invalidIcmsStRetid(icms) {
        return !icms.vBCSTRet || !icms.vICMSSTRet || !icms.vBCSTDest || !icms.vICMSSTDest;
    }

    function invalidIcmsDife(icms) {
        return !icms.vICMSOp || (icms.pDif == null) || !icms.vICMSDif;
    }

    function invalidIcmsStRetidoAnter(icms) {
        return !icms.vBCSTRet || !icms.vICMSSTRet;
    }

    function mapEnum(data) {
        return data.key;
    }

    function mountIcms(icms) {
        var obj = {
            CST: icms.CST,
            version: icms.version,
            cfop: icms.cfop,
            mensagem: icms.mensagem,
            mensagemRef: icms.mensagemRef,
            cfopRef: icms.cfopRef,
            pReducaoBase:icms.pReducaoBase
        };

        if (icms.CST === 'INTEGRALMENTE_00' || icms.CST === 'COBRANCA_ST_10' ||
            icms.CST === 'OUTRAS_COM_PARTILHA_90' || icms.CST === 'COBRANCA_ST_10_COM_PARTILHA' ||
            icms.CST === 'REDUCAO_BC_20' || icms.CST === 'DIFERIMENTO_51' ||
            icms.CST === 'ST_REDUCAO_BC_70' || icms.CST === 'OUTROS_90') {
            obj.modBC = icms.modBC;
            obj.pICMS = icms.pICMS;
            obj.vBC = icms.vBC;
            obj.vICMS = icms.vICMS;
        }

        if (icms.CST === 'COBRANCA_ST_10' || icms.CST === 'OUTRAS_COM_PARTILHA_90' ||
            icms.CST === 'COBRANCA_ST_10_COM_PARTILHA' || icms.CST === 'ISENTA_COM_ST_30' ||
            icms.CST === 'ST_REDUCAO_BC_70' || icms.CST === 'OUTROS_90') {
            obj.modBCST = icms.modBCST;
            obj.pICMSST = icms.pICMSST;
            obj.pMVAST = icms.pMVAST;
            obj.pRedBCST = icms.pRedBCST;
            obj.vBCST = icms.vBCST;
            obj.vICMSST = icms.vICMSST;
        }

        if (icms.CST === 'OUTRAS_COM_PARTILHA_90' || icms.CST === 'COBRANCA_ST_10_COM_PARTILHA') {
            obj.UFST = icms.UFST;
        }

        if (icms.CST === 'REDUCAO_BC_20' || icms.CST === 'ISENTA_COM_ST_30' ||
            icms.CST === 'ISENTA_40' || icms.CST === 'NAO_TRIBUTADA_41' ||
            icms.CST === 'SUSPENSAO_50' || icms.CST === 'ST_REDUCAO_BC_70' ||
            icms.CST === 'OUTROS_90') {
            obj.vICMSDeson = icms.vICMSDeson;
            obj.motDesICMS = icms.motDesICMS;
        }

				if (icms.CST === 'NAO_TRIBUTADA_41_ICMSST') {
					obj.vBCSTRet = icms.vBCSTRet;
					obj.vBCSTDest = icms.vBCSTDest;
					obj.vICMSSTDest = icms.vICMSSTDest;
					obj.vICMSSTRet = icms.vICMSSTRet;
				}

				if (icms.CST === 'DIFERIMENTO_51') {
					obj.pDif = icms.pDif;
					obj.vICMSDif = icms.vICMSDif;
					obj.vICMSOp = icms.vICMSOp;
				}

				if (icms.CST === 'COBRADO_ANTERIORMENTE_POR_ST_60') {
					obj.vBCSTRet = icms.vBCSTRet;
					obj.vICMSSTRet = icms.vICMSSTRet;
				}
				return obj;
			}

    function mountIcmsSimples(icms) {
        var obj = {
            version: icms.version,
            cfop: icms.cfop,
            mensagem: icms.mensagem,
            CSOSN: icms.CSOSN,
            mensagemRef: icms.mensagemRef,
            cfopRef: icms.cfopRef,
            pReducaoBase: icms.pReducaoBase
        };

        if (icms.CSOSN === 'CREDITO_101' ||
            icms.CSOSN === 'CREDITO_COM_ST_201' ||
            icms.CSOSN === 'OUTROS_900') {
            obj.pCredSN = icms.pCredSN;
            obj.vCredICMSSN = icms.vCredICMSSN;
        }

        if (icms.CSOSN === 'CREDITO_COM_ST_201' ||
            icms.CSOSN === 'SEM_CREDITO_COM_ST_202' ||
            icms.CSOSN === 'RECEITA_BRUTA_COM_ST_203' ||
            icms.CSOSN === 'OUTROS_900') {
            obj.modBCST = icms.modBCST;
            obj.pICMSST = icms.pICMSST;
            obj.pMVAST = icms.pMVAST;
            obj.pRedBCST = icms.pRedBCST;
            obj.vBCST = icms.vBCST;
            obj.vICMSST = icms.vICMSST;
        }

        if (icms.CSOSN === 'ANTECIPACAO_ST_500') {
            obj.vBCSTRet = icms.vBCSTRet;
            obj.vICMSSTRet = icms.vICMSSTRet;
        }

        if (icms.CSOSN === 'OUTROS_900') {
            obj.modBC = icms.modBC;
            obj.vBC = icms.vBC;
            obj.pRedBC = icms.pRedBC;
            obj.pICMS = icms.pICMS;
            obj.vICMS = icms.vICMS;
        }
        return obj;
    }

    function mountPis(pis) {
        var obj = {
            CST: pis.CST,
            version: pis.version,
            mensagem: pis.mensagem
        };

        switch (pis.CST) {
            case 'OPERACAO_TRIBUTAVEL_05':
                obj.calculationTypeST = pis.calculationTypeST;
                if (pis.calculationTypeST === 'PORCENTAGEM') {
                    obj.pPISST = pis.pPISST;
                    obj.vBCST = pis.vBCST;
                    obj.vPISST = pis.vPISST;
                }
                break;
            case 'OPERACAO_TRIBUTAVEL_01':
            case 'OPERACAO_TRIBUTAVEL_02':
                obj.pPIS = pis.pPIS;
                obj.vBC = pis.vBC;
                obj.vPIS = pis.vPIS;
                break;
            case 'OUTRAS_SAIDAS_49':
            case 'OPERACOES_CREDITO_50':
            case 'OPERACOES_CREDITO_51':
            case 'OPERACOES_CREDITO_52':
            case 'OPERACOES_CREDITO_53':
            case 'OPERACOES_CREDITO_54':
            case 'OPERACOES_CREDITO_55':
            case 'OPERACOES_CREDITO_56':
            case 'CREDITO_PRESUMIDO_60':
            case 'CREDITO_PRESUMIDO_61':
            case 'CREDITO_PRESUMIDO_62':
            case 'CREDITO_PRESUMIDO_63':
            case 'CREDITO_PRESUMIDO_64':
            case 'CREDITO_PRESUMIDO_65':
            case 'CREDITO_PRESUMIDO_66':
            case 'CREDITO_PRESUMIDO_67':
            case 'AQUISICAO_SEM_CREDITO_70':
            case 'AQUISICAO_ISENTA_71':
            case 'AQUISICAO_COM_SUSPENSAO_72':
            case 'AQUISICAO_ALIQUOTA_ZERO_73':
            case 'AQUISICAO_SEM_CONTRIBUICAO_74':
            case 'AQUISICAO_ST_75':
            case 'OUTRAS_ENTRADAS_98':
            case 'OUTRAS_99':
                obj.calculationType = pis.calculationType;
                if (pis.calculationType === 'PORCENTAGEM') {
                    obj.pPIS = pis.pPIS;
                    obj.vBC = pis.vBC;
                    obj.vPIS = pis.vPIS;
                }
                break;
            default:
        }
        return obj;
    }

    function mountCofins(cofins) {
        var obj = {
            CST: cofins.CST,
            version: cofins.version,
            mensagem: cofins.mensagem
        };
        switch (cofins.CST) {
            case 'OPERACAO_TRIBUTAVEL_05':
                obj.calculationTypeST = cofins.calculationTypeST;
                if (cofins.calculationTypeST === 'PORCENTAGEM') {
                    obj.pCOFINSST = cofins.pCOFINSST;
                    obj.vBCST = cofins.vBCST;
                    obj.vCOFINSST = cofins.vCOFINSST;
                }
                break;
            case 'OPERACAO_TRIBUTAVEL_01':
            case 'OPERACAO_TRIBUTAVEL_02':
                obj.pCOFINS = cofins.pCOFINS;
                obj.vBC = cofins.vBC;
                obj.vCOFINS = cofins.vCOFINS;
                break;
            case 'OUTRAS_SAIDAS_49':
            case 'OPERACOES_CREDITO_50':
            case 'OPERACOES_CREDITO_51':
            case 'OPERACOES_CREDITO_52':
            case 'OPERACOES_CREDITO_53':
            case 'OPERACOES_CREDITO_54':
            case 'OPERACOES_CREDITO_55':
            case 'OPERACOES_CREDITO_56':
            case 'CREDITO_PRESUMIDO_60':
            case 'CREDITO_PRESUMIDO_61':
            case 'CREDITO_PRESUMIDO_62':
            case 'CREDITO_PRESUMIDO_63':
            case 'CREDITO_PRESUMIDO_64':
            case 'CREDITO_PRESUMIDO_65':
            case 'CREDITO_PRESUMIDO_66':
            case 'CREDITO_PRESUMIDO_67':
            case 'AQUISICAO_SEM_CREDITO_70':
            case 'AQUISICAO_ISENTA_71':
            case 'AQUISICAO_COM_SUSPENSAO_72':
            case 'AQUISICAO_ALIQUOTA_ZERO_73':
            case 'AQUISICAO_SEM_CONTRIBUICAO_74':
            case 'AQUISICAO_ST_75':
            case 'OUTRAS_ENTRADAS_98':
            case 'OUTRAS_99':
                obj.calculationType = cofins.calculationType;
                if (cofins.calculationType === 'PORCENTAGEM') {
                    obj.pCOFINS = cofins.pCOFINS;
                    obj.vBC = cofins.vBC;
                    obj.vCOFINS = cofins.vCOFINS;
                }
                break;
            default:
                break;
        }
        return obj;
    }

    function mountIpi(ipi) {
        var obj = {
            CST: ipi.CST,
            version: ipi.version,
            mensagem: ipi.mensagem,
            enquadramentoIpi: ipi.enquadramentoIpi
        };

        switch (ipi.CST) {
            case 'ENTRADA_RECUPERACAO_CREDITO_00':
            case 'OUTRAS_ENTRADAS_49':
            case 'SAIDA_TRIBUTADA_50':
            case 'OUTRAS_SAIDAS_99':
                obj.ipiCalculationType = ipi.ipiCalculationType;
                if (ipi.ipiCalculationType === 'PORCENTAGEM') {
                    obj.pIPI = ipi.pIPI;
                    obj.vBC = ipi.vBC;
                    obj.vIPI = ipi.vIPI;
                }
                break;
            default:
        }
        return obj;
    }

    //Funções dos conflitos na grade
    function mountConflicts(values) {
        $scope.stateOriginConflicts = mountNewArr(values, 'destinations', 'key');
        $scope.stateDestinationConflicts = mountNewArr(values, 'destinations', 'key');
        $scope.personGroupConflicts = mountNewArr(values, 'personGroup', 'key');
        $scope.operationConflicts = mountNewArr(values, 'operationTypes', 'id');
        $scope.productGroupConflicts = mountNewArr(values, 'productGroups', 'id');
    }

    function mountNewArr(arr, field, comparationField) {
        var newArr = [],
            toReturn = [];
        arr.forEach(function (data) {
            data[field].forEach(function (value) {
                newArr[value[comparationField]] = value;
            });
        });
        for (key in newArr) {
            toReturn.push(newArr[key]);
        }
        return toReturn;
    }

    function operationConditional(value) {
        return {
            '2px solid red': function () {
                return $scope.operationConflicts.filter(function (data) {
                        return data.id === value.id;
                    }).length > 0;
            }
        }
    }

    $scope.showAliquotaGroup = function (icms) {
        return icms.CSOSN === 'CREDITO_101' || icms.CSOSN === 'CREDITO_COM_ST_201' || icms.CSOSN === 'OUTROS_900';
    };
    $scope.showIcmsStSimple = function (icms) {
        return icms.CSOSN === 'CREDITO_COM_ST_201' ||
            icms.CSOSN === 'SEM_CREDITO_COM_ST_202' ||
            icms.CSOSN === 'RECEITA_BRUTA_COM_ST_203' ||
            icms.CSOSN === 'OUTROS_900'
    };
    $scope.showSimples = function (icms) {
        return icms.CSOSN === 'CREDITO_101' ||
            icms.CSOSN === 'CREDITO_COM_ST_201' ||
            icms.CSOSN === 'OUTROS_900';
    };
    $scope.showSimplesSt = function (icms) {
        return icms.CSOSN === 'CREDITO_COM_ST_201' ||
            icms.CSOSN === 'SEM_CREDITO_COM_ST_202' ||
            icms.CSOSN === 'RECEITA_BRUTA_COM_ST_203' ||
            icms.CSOSN === '' ||
            icms.CSOSN === 'OUTROS_900';
    };
    $scope.isFCPVisible = function (icms) {
        return icms.CSOSN !== 'IMUNE_300' &&
            icms.CSOSN !== 'NAO_TRIBUTADA_400' &&
            icms.CST !== 'NAO_TRIBUTADA_41' &&
            icms.CST !== 'NAO_TRIBUTADA_41_ICMSST';
    };

    $scope.searchEnquadramento = function (param) {
        return CodigoEnquadramentoIpiService.getSearch('descricao,codigo', param).then(function (data) {
            return data.data.values;
        })
    };
}
module.exports = TaxSettingsFormController;