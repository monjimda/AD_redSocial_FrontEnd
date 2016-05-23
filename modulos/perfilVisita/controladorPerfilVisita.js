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
            $rootScope.esAmigo=1;
            $location.path("/perfilVisita");
        
        })
        .catch(function(err) {
         //Tratamos el error.

        console.log("error");
        });
        
        //cambiamos el estado de la referencia a 'borrador'
        
    }
    if($rootScope.esAmigo===2){//CAMBIAR RESULT Y DATA POR PERFILVISITAR.ALGO
        var result=$rootScope.perfilVisitar.fotos;
        console.log("fotos pre",result);
        var data=angular.copy(result);
        for(var i=0;i<data.length;i++){
            console.log(i,data.length);
            data[i]=data[i].substring(data[i].indexOf("FrontEnd/") + 9);
            
            if (data[i].toLowerCase().indexOf("perfil") >= 0){
                var elemEliminar=i;
                
            }
        }
        
                console.log(data[elemEliminar].substring(data[elemEliminar].indexOf("FrontEnd/") + 9));
                data.splice(elemEliminar,1);//ELIMINAMOS EL DE PERFIL PARA DEJAR EL RESTO
        
        console.log("fotos despues",data);
        
        $scope.fotos=data;
        //$scope.fotos=["imagenes/a/perfil.png", "C:/Users/Alejandro/Desktop/Curso 15_16/AD/AD_redSocial_BackEnd/imagenes/a/null.png"];
        console.log("imagen dev");

        $scope.verFoto = function (self){
            window.open(self.foto);
            console.log(self.foto);
        
    }
        
        
        var nodeData;
    var operacion;
    $scope.nodoSeleccionado={};
    $scope.nodoSeleccionado.clase="raiz";
    $scope.clientes={};
    //$scope.clientes.elemSeleccionado={};
    //console.log($scope.clientes.elemSeleccionado.value);
    
    function toast(texto) {
		$mdToast.show(
			$mdToast.simple().content(texto).position('top right').hideDelay(1500)
		);
	}
       
    servicioRest.getTablon($rootScope.idPerfilVisitar).then(
        function (response) {
            actualizarArbol(response);
        });
    
    function actualizarArbol(arbol){                               
            recorrerArbol(arbol);                        
            $scope.data = [];                      
            $scope.data[0] = arbol;                  
    };
    
    
    
    function recorrerArbol(response){
        if(response.nodosHijos != null){
            for(var i=0; i<response.nodosHijos.length; i++){
                recorrerArbol(response.nodosHijos[i]);
            }
        }
        else{
            response.nodosHijos=[];
        }
    };
    
    $scope.nodoSeleccionado=null;
    
    // Iniciamos el nodo selleccionado a undefined para indicar que inicialmente no hay ninguno seleccionado
    var elementoSeleccionado=undefined;
    
    $scope.ocultarHijos = function (nodo){
        toggle(nodo);
        console.log("aa");
    }
    
    
    $scope.eliminarElem=function(ev, scope){
        if(true){
            ev.stopImmediatePropagation();
            servicioRest.deleteComentario(scope.$modelValue._id, $rootScope.idPerfilVisitar)
                .then(function(data) {
                    //eliminarNodo(scope);
                    actualizarArbol(data);
                toast("Tecnologia eliminada");

                }).catch(function(err) {
                console.log(err);
                    utils.popupInfo('',err);
                    console.log("Error al eliminar tecnologia");
                    servicioRest.getTablon($rootScope.idPerfilVisitar).then(
                    function (response) {
                        actualizarArbol(response);
                    });
                });   
        }
        else{
            utils.popupInfo('',"Error al borrar<br>Hay tecnologias dentro");
        }
    };
    
    $scope.aniadirElem=function(ev, scope, tipoElem){
        $scope.hayError=false;
        ev.stopImmediatePropagation();
        $scope.titulo = "Enviar comentario";
        $scope.nodoSeleccionado={'clase':tipoElem};
        nodeData=scope.$modelValue;
        operacion="anadir";
        setTimeout(function(){ 
            //Se necesita un tiem out para dar tiempo a que se cargue el lanzar ayuda
            nombreTecnologia.focus();
        }, 100)
    };
    
    $scope.seleccionarElemento=function(elem, nodo){
        
        $scope.hayError=false;
        var tipo;
        switch(nodo.clase){
                
            case "hojaInvalida":  tipo = "Competencia pendiente de validar";
                break;
            case "nodo":  tipo = "Competencia intermedia";
                break;
            case "hoja":  tipo = "Competencia final";
                break;
            default:tipo = nodo.clase;
        }
        $scope.titulo = "Editar " + tipo;
        nodeData=nodo;
        if(nodeData.clase=="nodo"){
            $scope.nodoSeleccionado={
            contenido: nodeData.contenido,
            nodosHijos: nodeData.nodosHijos,
            clase: nodeData.clase
            
            };
        } else {
            //Se elimina el texto del autocumplete de rechazar competencia
            $scope.nodoSeleccionado={
            contenido: nodeData.contenido,
            nodosHijos: nodeData.nodosHijos,
            producto: nodeData.producto,
            tipo: nodeData.tipo,
            clase: nodeData.clase
            };
        }

        
        elem=elem.$element;
        
        // Modificaremos el elemento seleccionado exclusivamente si no se ha hecho click en un elemenyto que ya estaba seleccionado
        if(elem !== elementoSeleccionado){
            
            // Añadimos la clase al elemento seleccionado actual
            elem.addClass("elementoSeleccionado");
            
            // Eliminamos la clase al anterior elemento seleccionado
            if(elementoSeleccionado!=undefined){
                elementoSeleccionado.removeClass("elementoSeleccionado");
            }
            
            // asignamos el elemento seleccionado al actual
            elementoSeleccionado = elem;
        }
        operacion="editar";
        setTimeout(function(){ 
            //Se necesita un tiem out para dar tiempo a que se cargue el lanzar ayuda
            nombreCompetencia.focus();
        }, 100)
        
    };
    
    $scope.guardarElem=function(){
        
            //------------Añadir elemento

                $scope.nodoSeleccionado.propietario=$rootScope.usuarioLS.nick;
                servicioRest.postComentario(nodeData._id, $scope.nodoSeleccionado.nombre, $scope.nodoSeleccionado.propietario, $rootScope.idPerfilVisitar)//el ult es $root.. perfilvisitaid en visita
                .then(function(data) {
                    console.log(data);
                    actualizarArbol(data);
                    getHojasValidadas();
                    toast("Tecnologia añadida");
                    //nodeData.nodosHijos.push($scope.nodoSeleccionado);
                }).catch(function(err) {
                    servicioRest.getTablon($rootScope.idPerfilVisitar).then(
                    function (response) {
                        actualizarArbol(response);
                    });
                    utils.popupInfo('',"Error al añadir tecnologia.");
                    console.log("Error al añadir tecnologia");
                }); 

             //------------Editar elemento
            $scope.nodoSeleccionado=null;

    };
    
    
        
        
        

    }


    
});