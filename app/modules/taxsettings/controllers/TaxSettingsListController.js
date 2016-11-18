define([], function () {

    TaxSettingsListController.$inject = ['TaxationGroupService', '$scope', 'gumgaController'];
    function TaxSettingsListController(TaxationGroupService, $scope, gumgaController) {
        gumgaController.createRestMethods($scope,TaxationGroupService,'taxationGroup');
        $scope.content = {};
        $scope.page = 1;

        $scope.conf = {
            columns : 'tribute,titleParameterization,button',
            selection : 'single',
            columnsConfig : [
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
                },
                {
                    name: 'button',
                    size: 'col-md-1',
                    title: ' '
                    ,content : '<button type="button" ui-sref="taxsettings.edit({id: $value.id})" uib-tooltip="Editar" grands-button="edit-sm"></button>'
                }
            ]
        };

        $scope.taxationGroup.execute('reset');
        $scope.taxationGroup.execute('get');
        $scope.taxationGroup.on('deleteSuccess', function(){
            $scope.taxationGroup.execute('get');
        });
    }

    return TaxSettingsListController;

});