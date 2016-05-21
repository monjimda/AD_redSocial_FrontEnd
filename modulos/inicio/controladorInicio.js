app.controller('controladorInicio', function(servicioRest, config, $scope, $http, $location, $rootScope, $mdDialog) {
    $scope.usuario = $rootScope.usuarioLS.nick;
    
    servicioRest.getPeticionesPendientes()
    .then(function(datos) {
        $scope.peticiones=datos;
    })
    .catch(function(err) {
     //Tratamos el error.

    console.log("error");
    });
    
    
    
    $scope.aceptarPeticion = function (nickAmigo){
        console.log(nickAmigo);
        servicioRest.aceptarPeticion(nickAmigo)
        .then(function(result) {
            servicioRest.getPeticionesPendientes()
            .then(function(datos) {
                $scope.peticiones=datos;
            })
            .catch(function(err) {
             //Tratamos el error.

            console.log("error");
            });            

        })
        .catch(function(err) {
         //Tratamos el error.

        console.log("error");
        });
        
    }
});



