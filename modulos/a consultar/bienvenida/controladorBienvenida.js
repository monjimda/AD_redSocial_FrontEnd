app.controller('controladorBienvenida', function(servicioRest, utils, $scope, $location, $rootScope) {  
    
    // cargamos menu segun role
    utils.cargarMenu($rootScope.usuarioLS.role);
    $scope.nombre=$rootScope.usuarioLS.name;
});
