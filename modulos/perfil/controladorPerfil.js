app.controller('controladorPerfil', function(servicioRest, config, $scope, $http, $location, $rootScope, $mdDialog) {
    servicioRest.getImagen()
    .then(function(result) {
        
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
        
    })
    .catch(function(err) {
     //Tratamos el error.

    console.log("error");
    });  
    
        /*document.getElementById("fotoPerfil").setAttribute('src',"http://www.zuliapordentro.com/wp-content/uploads/2016/02/new-google-logo.jpg");
    $scope.prueba="http://www.zuliapordentro.com/wp-content/uploads/2016/02/new-google-logo.jpg";//DOWNLOAD BUTTON*/
    var reader=new FileReader();
    $scope.hola=function(){
        
        
        var reader = new FileReader();
            reader.onload = function (e) {
                $scope.prueba=e.target.result;
                //img.src.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
                document.getElementById("fotoPerfil").setAttribute('src', e.target.result);
};
            reader.readAsDataURL(document.getElementById("botonFileReal").files[0]);
        console.log(document.getElementById("botonFileReal").files[0]);
        var fileReader = new FileReader();
            
            if(undefined!=document.getElementById("botonFileReal").files[0]){
                
                var imagen = document.getElementById("botonFileReal").files[0];
                fileReader.readAsBinaryString(imagen);
                fileReader.onloadend = function(e)
                {
                    var objeto = e.target.result;
                    objeto = btoa(objeto);
                    servicioRest.postImagen(objeto, true)
                        .then(function(data) {
                            console.log("imagen guardada");

                        })
                        .catch(function(err) {
                         //Tratamos el error.

                        console.log("error");
                        });    
                 }
                
            }
        
    }
    $scope.subirFoto = function (){
        console.log("hola");
        document.getElementById('botonFileReal').click();//.then({
            //console.log("hola");
            //document.getElementById("fotoPerfil").setAttribute("src",$scope.referencia.imagenProyecto)
        //});
        
        
    }
    
    $scope.subirUnaFoto = function () {
        
        subirUnaFotoPopUp(event);
        
        //cambiamos el estado de la referencia a 'borrador'
        
    }
    
    subirUnaFotoPopUp = function(ev) {
        $mdDialog.show({
            controller: 'controladorRechazarReferencia',
            templateUrl: 'modulos/popUp/rechazarReferencia.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false
        })
        .then(function(ficheroFoto) {
            
            var reader = new FileReader();
            
            reader.readAsDataURL(ficheroFoto);
        console.log(ficheroFoto);
        var fileReader = new FileReader();
            
            if(undefined!=ficheroFoto){
                
                var imagen = ficheroFoto;
                fileReader.readAsBinaryString(imagen);
                fileReader.onloadend = function(e)
                {
                    var objeto = e.target.result;
                    objeto = btoa(objeto);
                    servicioRest.postImagen(objeto, false)
                        .then(function(data) {
                            console.log("imagen guardada");
                            
                            servicioRest.getImagen()
                            .then(function(result) {

                                console.log("fotos pre",result);
                                var data=angular.copy(result);
                                for(var i=0;i<data.length;i++){
                                    console.log(i,data.length);
                                    data[i]=data[i].substring(data[i].indexOf("FrontEnd/") + 9);

                                    if (data[i].toLowerCase().indexOf("perfil") >= 0){
                                        var elemEliminar=i;

                                    }
                                }

                                        data.splice(elemEliminar,1);//ELIMINAMOS EL DE PERFIL PARA DEJAR EL RESTO

                                console.log("fotos despues",data);

                                $scope.fotos=data;
                                //$scope.fotos=["imagenes/a/perfil.png", "C:/Users/Alejandro/Desktop/Curso 15_16/AD/AD_redSocial_BackEnd/imagenes/a/null.png"];
                                console.log("imagen dev");

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
                
            }
                 
            })
        .catch(function(err) {
                utils.popupInfo('',"Error al rechazar la referencia.");
                console.log("Error al rechazar la referencia");
            });
    };
    
    $scope.verFoto = function (self){
    window.open(self.foto);
        console.log(self.foto);
        
    }
    
    //$scope.prueba="http://www.doralnewsonline.com/doralfinal/wp-content/uploads/2015/10/new-and-old-google-logos.jpg";
    
    /*------------------- PROYECTO DEMO DE CHAT CON WEBSOCKETS https://github.com/socketio/socket.io/tree/master/examples/chat -------------------*/

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
       
    servicioRest.getTecnologias().then(
        function (response) {
            console.log("tablon",response);
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
    
    $scope.nodoSeleccionado;
    
    // Iniciamos el nodo selleccionado a undefined para indicar que inicialmente no hay ninguno seleccionado
    var elementoSeleccionado=undefined;
    
    
    $scope.tipos=["OpenSource", "Suscripción", "Licencia"];
    
    $scope.eliminarElem=function(ev, scope){
        if(scope.$modelValue.nodosHijos[0]==null){
            ev.stopImmediatePropagation();
            servicioRest.deleteTecnologia(scope.$modelValue.nombre)
                .then(function(data) {
                    //eliminarNodo(scope);
                    actualizarArbol(data);
                toast("Tecnologia eliminada");

                }).catch(function(err) {
                console.log(err);
                    utils.popupInfo('',err);
                    console.log("Error al eliminar tecnologia");
                    servicioRest.getTecnologias().then(
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
        var tipo;
        switch(tipoElem){
                
            case "hojaInvalida":  tipo = "Tecnologia pendiente de validar";
                break;
            case "nodo":  tipo = "Tecnologia intermedia";
                break;
            case "hoja":  tipo = "Tecnologia final";
                break;
            default:tipo = tipoElem;
        }
        ev.stopImmediatePropagation();
        $scope.titulo = "Añadir " + tipo;
        $scope.nodoSeleccionado={'clase':tipoElem};
        nodeData=scope.$modelValue;
        operacion="anadir";
        $scope.estaValidado=$scope.nodoSeleccionado.clase==='hoja';
        setTimeout(function(){ 
            //Se necesita un tiem out para dar tiempo a que se cargue el lanzar ayuda
            nombreTecnologia.focus();
        }, 100)
    };
    
        
    function comprobarArbol(nodos, nombreNodo, encontrado){
        if(nodos.nodosHijos != null){
            var i=0;
            while(!encontrado && i<nodos.nodosHijos.length){
                if(nodos.nodosHijos[i].nombre===nombreNodo){
                    encontrado=true;
                }
                else{
                    encontrado = comprobarArbol(nodos.nodosHijos[i], nombreNodo, encontrado);
                }
                i++;
            }
        }
        return encontrado;
    };
    
    $scope.guardarElem=function(){
        
        var nombreRepetido = comprobarArbol($scope.data[0], $scope.nodoSeleccionado.nombre, false);
        //var nombreRepetido=false;
        if(!nombreRepetido || (operacion==="editar" && nodeData.nombre===$scope.nodoSeleccionado.nombre)){
            //------------Añadir elemento
            if(operacion=="anadir"){
                servicioRest.postTecnologia(nodeData.nombre, $scope.nodoSeleccionado)
                .then(function(data) {
                    actualizarArbol(data);
                    getHojasValidadas();
                    toast("Tecnologia añadida");
                    //nodeData.nodosHijos.push($scope.nodoSeleccionado);
                }).catch(function(err) {
                    servicioRest.getTecnologias().then(
                    function (response) {
                        actualizarArbol(response);
                    });
                    utils.popupInfo('',"Error al añadir tecnologia.");
                    console.log("Error al añadir tecnologia");
                }); 
            }
             //------------Editar elemento
            else if (operacion=="editar"){
                var oldId=nodeData.nombre;


                servicioRest.putTecnologia(oldId, $scope.nodoSeleccionado)
                .then(function(data) {
                    actualizarArbol(data);
                    getHojasValidadas();
                    toast("Tecnologia modificada");
                    /*nodeData.nombre=$scope.nodoSeleccionado.nombre;
                    if(nodeData.clase!="nodo"){
                        nodeData.tipo=$scope.nodoSeleccionado.tipo;
                        nodeData.producto=$scope.nodoSeleccionado.producto;
                    }*/
                }).catch(function(err) {
                    servicioRest.getTecnologias().then(
                    function (response) {
                        actualizarArbol(response);
                    });
                    utils.popupInfo('',"Error al editar tecnologia.");
                    console.log("Error al editar tecnologia");
                }); 
            }
            $scope.nodoSeleccionado=null;
        }
        else{
            utils.popupInfo('',"El nombre de la tecnologia ya esta en uso");
        }
    };
    
      



    
});