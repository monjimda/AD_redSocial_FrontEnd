app.controller('controladorPerfilVisita', function(servicioRest, config, $scope, $http, $location, $rootScope, $mdDialog) {
    if($rootScope.esAmigo===0){
        $scope.mensajePeticion="No eres amigo de este usuario, si quieres ver su perfil enviale una peticion de amistad";
    }else if($rootScope.esAmigo===1){
        $scope.mensajePeticion="No eres amigo de este usuario, debes esperar a que acepte tu invitacion";
    }
    
    $scope.aniadirAmigo = function () {
        console.log($rootScope.idPerfilVisitar);
        servicioRest.enviarPeticion($rootScope.idPerfilVisitar)
        .then(function(data) {
            
        
        })
        .catch(function(err) {
         //Tratamos el error.

        console.log("error");
        });
        
        //cambiamos el estado de la referencia a 'borrador'
        
    }
    if($rootScope.esAmigo===3){//CAMBIAR RESULT Y DATA POR PERFILVISITAR.ALGO
        
        console.log("fotos pre",result);
        var data=angular.copy(result);
        for(var i=0;i<data.length;i++){
            console.log(i,data.length);
            data[i]=data[i].substring(data[i].indexOf("FrontEnd/") + 9);
            
            if (data[i].toLowerCase().indexOf("perfil") >= 0){
                var elemEliminar=i;
                
            }
        }
        
        document.getElementById("fotoPerfil").setAttribute('src',data[elemEliminar]);
                console.log(data[elemEliminar].substring(data[elemEliminar].indexOf("FrontEnd/") + 9));
                $scope.prueba=data[elemEliminar];//DOWNLOAD BUTTON
                data.splice(elemEliminar,1);//ELIMINAMOS EL DE PERFIL PARA DEJAR EL RESTO
        
        console.log("fotos despues",data);
        
        $scope.fotos=data;
        //$scope.fotos=["imagenes/a/perfil.png", "C:/Users/Alejandro/Desktop/Curso 15_16/AD/AD_redSocial_BackEnd/imagenes/a/null.png"];
        console.log("imagen dev");

        $scope.verFoto = function (self){
            window.open(self.foto);
            console.log(self.foto);
        
    }

    }


    
});