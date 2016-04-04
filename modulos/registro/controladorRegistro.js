app.controller('controladorRegistro', function(servicioRest, config, $scope, $http, $location, $rootScope, $mdDialog, utils) {
    
   $scope.title = "";
   $scope.descripcion = "";
    var self = this,  j= 0, counter = 0;
    $scope.mensaje='';
    $scope.activado = self.activated;
    
    
    $scope.crear = function (evento) {
        if($scope.user.password === $scope.passwordRepetida){
        var mensaje='';
console.log($scope.user.fechaCumpleanios);
            servicioRest.postUsuario($scope.user)
            .then(function(data) {
                $scope.mensaje='Usuario creado con éxito';
                utils.popupInfo('Usuario creado con éxito');
                $location.path('/');
            })
            .catch(function(err) {
                utils.popupInfo('Error al registrar usuario');
            });

        }else{
            utils.popupInfo('La contraseña no coincide');
        }
        
    };
        
});    
	

    
