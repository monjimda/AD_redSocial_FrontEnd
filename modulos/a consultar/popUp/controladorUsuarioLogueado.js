app.controller('controladorUsuarioLogueado', function(servicioRest, config, $scope, $http, $location, $rootScope) {  
    
    $scope.nameUsu=$rootScope.usuarioLS.name;
    $scope.rolUsu='gfdgfd';
    
   /* debería de renombrarlo pero no lo hace */
    switch($rootScope.usuarioLS.role) {
    case "ROLE_ADMINISTRADOR":
         $scope.rolUsu = 'Administrador';
        break;
    case "ROLE_MANTENIMIENTO":
        $scope.rolUsu = 'Mantenimiento';
        break;
    case "ROLE_VALIDADOR":
        $scope.rolUsu = 'Validador';
        break;
    case "ROLE_CONSULTOR":
        $scope.rolUsu = 'Consultor';
        break;
    default:
        servicioRest.popupError(null,"Rol incorrecto");
        $location.path('/');
        
    }
});