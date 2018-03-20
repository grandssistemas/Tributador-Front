TaxSettingsListController.$inject = ['TaxationGroupService', '$scope', 'gumgaController', 'SweetAlert', 'ConfigService'];
function TaxSettingsListController(TaxationGroupService, $scope, gumgaController, SweetAlert, ConfigService) {
    gumgaController.createRestMethods($scope, TaxationGroupService, 'taxationGroup');

    var GQueryBase = new GQuery();
        // .select("obj.name as name")
        // .select("obj.id as id")
        // .select("obj.oi as oi")
        // .select("obj.taxationCOFINS.id as taxationCOFINS")
        // .select("obj.taxationIPI.id as taxationIPI")
        // .select("obj.taxationPIS.id as taxationPIS")
        // .select("obj.taxationICMS.id as taxationICMS");

    $scope.proxySearchWithGQuery = function (param) {
        $scope.taxationGroup.methods.searchWithGQuery(GQueryBase.and(param))
    };

    $scope.taxationGroup.methods.searchWithGQuery(GQueryBase);

    $scope.validBuddy = function (oi, id) {
        return ConfigService.validateBuddy(oi, id);
    };

    $scope.getIcon = (value) => {
        $scope.iconFabs = !value.oi ? "search" : "edit";
        $scope.translateIcon = !value.oi ? "Vizualizar" : "Editar";
    };

    $scope.conf = {
        columns: 'tribute,titleParameterization,acoes',
        selection: 'single',
        materialTheme: true,
        activeLineColor: '#cccccc',
        hoverLineColor: '#f5f5f5',
        itemsPerPage: [5, 10, 25, 50, 100],
        title: 'Listagem de Tributos',
        columnsConfig: [
            {
                name: 'tribute',
                size: 'col-md-3',
                title: '<strong gumga-translate-tag="taxsettings.tribute">Tribute</strong>',
                content: '<div>{{$value.taxationICMS?\' ICMS\':\'\'}}{{$value.taxationIPI?\' IPI\':\'\'}}{{$value.taxationPIS?\' PIS\':\'\'}}{{$value.taxationCOFINS?\' COFINS\':\'\'}}</div>'
            },
            {
                name: 'titleParameterization',
                size: 'col-md-8',
                title: '<strong gumga-translate-tag="taxsettings.titleparameterization">Title parameterization</strong>',
                content: '<div>{{$value.name}}</div>'
            }, {
                name: 'acoes',
                alignColumn: 'center',
                alignRows: 'center',
                size: 'col-md-1',
                title: ' ',
                content:
                '<button style="display:inline-block" ' +
                'type="button"' +
                'ng-show="!$parent.$parent.validBuddy($value.oi, $value.id)" ' +
                'uib-tooltip="Copiar registro"' +
                'ng-click="$parent.$parent.copyDeleteRecord($value.id)"' +
                ' class="btn-link btn-xs">' +
                '<i class="fa fa-plus text-success"></i>' +
                '</button>' +
                '<button style="display:inline-block" ' +
                    'type="button" ' +
                'ng-show="!$parent.$parent.validBuddy($value.oi.value, $value.id)" uib-tooltip="Este registro é publico" ' +
                'class="btn-link btn-xs"><i class="fa fa-users" aria-hidden="true"></i></button>',
                widthPorcentage: 20
            }
        ]
    };

    $scope.copyDeleteRecord = (id) => {

        SweetAlert.swal({
                title: 'Atenção.',
                text: 'Após a cópia do registro o mesmo antigo será inativado para que não haja conflito de infomações. Deseja realmente fazer a cópia?',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55', confirmButtonText: "Sim",
                cancelButtonText: 'Não',
                closeOnConfirm: false,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    TaxationGroupService.copyAndDeleteRecord(id).then(function () {
                    });
                    SweetAlert.swal("Pronto!", "Copiado com sucesso", "success");
                }
            });


    };

    $scope.taxationGroup.execute('reset');

    $scope.taxationGroup.on('deleteSuccess', function () {
        $scope.taxationGroup.methods.getLatestOperation();
    });

}
module.exports = TaxSettingsListController;