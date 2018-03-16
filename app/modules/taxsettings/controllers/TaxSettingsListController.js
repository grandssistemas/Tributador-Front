TaxSettingsListController.$inject = ['TaxationGroupService', '$scope', 'gumgaController'];
function TaxSettingsListController(TaxationGroupService, $scope, gumgaController) {
    gumgaController.createRestMethods($scope, TaxationGroupService, 'taxationGroup');

    var GQueryBase = new GQuery()
        .select("obj.name as name")
        .select("obj.id as id")
        .select("obj.taxationCOFINS.id as taxationCOFINS")
        .select("obj.taxationIPI.id as taxationIPI")
        .select("obj.taxationPIS.id as taxationPIS")
        .select("obj.taxationICMS.id as taxationICMS");

    $scope.proxySearchWithGQuery = function (param) {
        $scope.taxationGroup.methods.searchWithGQuery(GQueryBase.and(param))
    };

    $scope.taxationGroup.methods.searchWithGQuery(GQueryBase);


    $scope.conf = {
        columns: 'tribute,titleParameterization',
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
            }
        ]
    };

    $scope.taxationGroup.execute('reset');

    $scope.taxationGroup.on('deleteSuccess', function () {
        $scope.taxationGroup.methods.getLatestOperation();
    });

}
module.exports = TaxSettingsListController;