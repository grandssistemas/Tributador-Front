define(['angular'], function (angular) {

    ModalConflitoController.$inject = ['entity','values','$scope','$uibModalInstance'];
    function ModalConflitoController(entity,values,$scope,$uibModalInstance) {

        entity        = angular.copy(entity);
        $scope.values = angular.copy(values);
        $scope.values = $scope.values.map(function(data){
            data.operationTypes = filterById(data.operationTypes, entity.operationTypes);
            data.productTypes   = filterById(data.productGroups, entity.productGroups);
            data.personTypes    = filterById(data.personGroups, entity.personGroups);
            data.destinations   = filterByKey(data.destinations, entity.destinations);
            data.origins        = filterByKey(data.origins,entity.origins);
            return data;
        });
        $scope.conf   = {
            columns : 'id,name,operations,origins,destinations,personTypes,productType',
            selection : 'none',
            columnsConfig : [
                {
                       name: 'id',
                       size: 'col-md-1',
                      title: '<strong gumga-translate-tag="taxsettings.id">Code</strong>',
                    content: '<div>{{$value.id}}</div>'
                },
                {
                    name: 'name',
                    size: 'col-md-1',
                    title: '<strong gumga-translate-tag="taxsettings.name">Tribute</strong>',
                    content: '<div>{{$value.name}}</div>'
                },
                {
                      name: 'operations',
                       size: 'col-md-2',
                      title: '<strong gumga-translate-tag="taxsettings.operations">Operations</strong>',
                    content: '<span ng-repeat="obj in $value.operationTypes track by $index"> {{!$first?\', \':\'\'}}{{obj.name}}</span>'
                },
                {
                       name: 'origins',
                       size: 'col-md-2',
                      title: '<strong gumga-translate-tag="taxsettings.origins">Origins</strong>',
                    content: '<span ng-repeat="obj in $value.origins track by $index"> {{!$first?\', \':\'\'}}{{obj.label}}</span>'
                },
                {
                       name: 'destinations',
                       size: 'col-md-2',
                      title: '<strong gumga-translate-tag="taxsettings.destinations">Destinations</strong>',
                    content: '<span ng-repeat="obj in $value.destinations track by $index"> {{!$first?\', \':\'\'}}{{obj.label}}</span>'
                },
                {
                       name: 'personTypes',
                       size: 'col-md-2',
                      title: '<strong gumga-translate-tag="taxsettings.groupofpeople">Group of People</strong>',
                    content: '<span ng-repeat="obj in $value.personTypes track by $index"> {{!$first?\', \':\'\'}}{{obj.name}}</span>'
                },
                {
                       name: 'productType',
                       size: 'col-md-2',
                      title: '<strong gumga-translate-tag="taxsettings.productgroup">Product Group</strong>',
                    content: '<span ng-repeat="obj in $value.productTypes track by $index"> {{!$first?\', \':\'\'}}{{obj.name}}</span>'
                }
            ]
        };
        $scope.close = function(){
            $uibModalInstance.close($scope.values);
        };


        function filterById(arr,insideArr){
            return arr.filter(function(data){
                return insideArr.filter(function(value){
                        return value.id === data.id;
                    }).length > 0;
            });
        }
        function filterByKey(arr,insideArr){
            return arr.filter(function(data){
                return insideArr.filter(function(value){
                        return value.key
                            === data.key;
                    }).length > 0;
            });
        }


    }

    return ModalConflitoController;

});