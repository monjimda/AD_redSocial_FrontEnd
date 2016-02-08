app.controller ('controladorGestionTecnologias', function (servicioRest, utils, config, $scope, $http, $rootScope, $mdDialog, $mdToast) {  
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
    
    $scope.eventosArbol = {
        //Cuando salte el evento (la clave), saltará la función de callback que contiene
        
        //cuando se intenta arrastrar un nodo a otro sitio. Si se retorna true, se podrá soltar ahí. Si no, no 
        accept: function(origen, destino, indiceDestino) {
            
            // No se podrá arrastrar un nodo raíz ( Si origen.$parentNodeScope != undefined ), ni se podrámover un elemento a nodo raíz ni fuera ( destino.$parent.$modelValue.nombre!=undefined ) ni se podrá mover un nodo hoja u hoja inválida (destino.$nodeScope.$modelValue.clase === 'nodo')
            
            // ¡¡¡ IMPORTANTE !!!! se compara con '!=' o '==' en lugar de '!==' y '===' porque a veces es null y otras undefined
            
            try{
               // return true;
                console.log("DESTINO:");/* Si se trata del elemento que contienen la raíz, será un array. Soi no, no tendrá $modelValue y dará unerror que recogeremos en el catch
                */
                return destino.$parent.$modelValue.nombre!=undefined 
                        && origen.$parentNodeScope != undefined 
                        && (destino.$nodeScope.$modelValue.clase === 'nodo'
                        || destino.$nodeScope.$modelValue.clase === 'raiz');
            }
            catch(error){
                //console.error(error);
                return false;
            }
        },
        
        //Cuando se ha movido el nodo
        dropped: function(e) {
            console.log("dropped");
            try{
                // Ponemos el nodo seleccionado a  null para que la introducción de datos desaparezca, ya que se pierde el knodo seleccionado al arrastrar
                $scope.nodoSeleccionado=null;
                
                // Obtenemos el padre del que se ha movido el nodo
                var padreOrigen = e.source.nodesScope.$parent.$modelValue.nombre;
                
                //Obtenemos el padre destino
                var padreDestino = e.dest.nodesScope.$parent.$modelValue.nombre;
                
                //Obtenemos el nodo a mover
                var nodo= e.source.nodeScope.$modelValue;
                // Hacer la llamada al back
                servicioRest.putMoverTecnologia(padreDestino, nodo)
                .then(function(data) {
                    //eliminarNodo(scope);
                    actualizarArbol(data);

                }).catch(function(err) {
                    utils.popupInfo('',"Error al mover tecnologia.");
                    console.log("Error al mover tecnologia");
                    servicioRest.getTecnologias().then(
                    function (response) {
                        actualizarArbol(response);
                    });
                });   
            }
            catch(error){
                //Se meterá en el catch en caso de que muevas el elemento raíz o que muevas un elemento fuera del raíz.
                //Como no tiene padre, saltará la excepción de que no existe $modelValue del $parent (NO DEBERÍA PASAR!!!!!)
                console.error(error);
            }
            
        }
    };
    
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
    
    $scope.seleccionarElemento=function(elem, nodo){
        
        $scope.hayError=false;
        var tipo;
        switch(nodo.clase){
                
            case "hojaInvalida":  tipo = "Tecnologia pendiente de validar";
                break;
            case "nodo":  tipo = "Tecnologia intermedia";
                break;
            case "hoja":  tipo = "Tecnologia final";
                break;
            default:tipo = nodo.clase;
        }
        $scope.titulo = "Editar " + tipo;
        nodeData=nodo;
        if(nodeData.clase=="nodo"){
            $scope.nodoSeleccionado={
            nombre: nodeData.nombre,
            nodosHijos: nodeData.nodosHijos,
            clase: nodeData.clase
            
            };
        } else {
            //Se elimina el texto del autocumplete de rechazar tecnologia
            $scope.clientes.texto="";
            $scope.nodoSeleccionado={
            nombre: nodeData.nombre,
            nodosHijos: nodeData.nodosHijos,
            producto: nodeData.producto,
            tipo: nodeData.tipo,
            clase: nodeData.clase
            };
        }
        console.log("aqui", nodo.nombre);
        servicioRest.getReferenciasAsociadas(nodo.nombre)
                .then(function(data) {
            //if(data!=[]){
                    
            $scope.hayRefAsociadas=data;
            console.log("data",data);
            //}
                }).catch(function(err) {
            console.log("err",err);
            //$scope.hayRefAsociadas=true;
                    
                });
        
        $scope.estaValidado=$scope.nodoSeleccionado.clase==='hoja';
        
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
    
    $scope.validarElem=function(){
        $mdDialog.show(
            $mdDialog.confirm()
            .clickOutsideToClose(true)
            .title('Validar hoja')
            .content('Estas seguro de querer validar la hoja?')
            .ariaLabel('Lucky day')
            .ok('Validar')
            .cancel('Cancelar')
        ).then(function() {
            nodeData.clase="hoja";
            $scope.nodoSeleccionado.clase="hoja";
            $scope.estaValidado=$scope.nodoSeleccionado.clase==='hoja';
            $scope.guardarElem();
        });
    };
    function getHojasValidadas(){
        servicioRest.getTecnologiasFinales().then(
            function(response) {
                var aux=[];
                for(var i=0;i<response.length;i++){
                    if(response[i].clase==="hoja"){
                        aux.push(response[i]);
                    }
                }
                $scope.clientes.lista= aux.map( function (tec) {
                    return {
                        value: tec.nombre,
                        display: tec.nombre
                    };
                });
                console.log($scope.clientes.lista);
            });
    }
    getHojasValidadas();
    
    $scope.filtrar = function (texto) {
        var resultado;
        var array;
        // Determinamos cual es el array a filtrar y cuanl es el índice del resultado    
            array=$scope.clientes.lista;
            $scope.posicionEnArray=undefined;
        // hacemos la búsqueda en el array
        if(texto!==""){
            //Si hay algo de texto, cogemos los elementos que tengan el texto en el nombre y/o en las siglas
            resultado=array.filter(function (cliente) {
                return (cliente.display.toLowerCase().indexOf(texto.toLowerCase()) !==-1);
            });
        }else{
            //si no hay texto, asignamos el resultado de la búsqueda al array completo para que se recarguen todos los datos
            resultado=array;
        }
        return resultado;
    }
        //cargamos los datos en el autocomplete a través del controlador          

    $scope.rechazarElem=function(hayRefAsociadas){
        if(hayRefAsociadas){
            
            if($scope.clientes.elemSeleccionado!=undefined){
                servicioRest.rechazarTecnologia(nodeData.nombre, $scope.clientes.elemSeleccionado.value).then(
                function (response) {
                    $scope.clientes.elemSeleccionado.value=undefined;
                    servicioRest.deleteTecnologia(nodeData.nombre)
                        .then(function(data) {
                            //eliminarNodo(scope);
                            actualizarArbol(data);
                            $scope.nodoSeleccionado=null;
                            toast("Tecnologia rechazada");

                        }).catch(function(err) {
                            utils.popupInfo('',"Error al rechazar tecnologia.");
                            console.log("Error al rechazar tecnologia");
                            servicioRest.getTecnologias().then(
                            function (response) {
                                actualizarArbol(response);
                            });
                        });  
                });
            }else{
                $scope.hayError=true;
            }
        }
        else{
            servicioRest.deleteTecnologia(nodeData.nombre)
                    .then(function(data) {
                        //eliminarNodo(scope);
                        actualizarArbol(data);
                        $scope.nodoSeleccionado=null;
                        toast("Tecnologia rechazada");

                    }).catch(function(err) {
                        utils.popupInfo('',"Error al rechazar tecnologia.");
                        console.log("Error al rechazar tecnologia");
                        servicioRest.getTecnologias().then(
                        function (response) {
                            actualizarArbol(response);
                        });
                    }); 
        }
    };
    
    /*             AYUDA                 */
    
    $scope.activarScroll=function(){     
        $scope.scroll=true;  
        $scope.nodoSeleccionado.clase="raiz";
    };
    
    $scope.ayuda = function(){
        $scope.scroll=false
        $scope.titulo="Ejemplo de edición";
        $scope.nodoSeleccionado.clase="hoja";
        $scope.nodoSeleccionado.nombre="Nombre Tecnologia";
        $scope.nodoSeleccionado.tipo="OpenSource";
        $scope.nodoSeleccionado.producto=true;
        $scope.lanzarAyuda();
        
    };
    
    setTimeout(function(){ 
            //Se necesita un tiem out para dar tiempo a que se cargue el lanzar ayuda
            $rootScope.lanzarAyuda=$scope.ayuda;
        }, 1000)
    
    $scope.introOptions = config.introOptions;
    
    $scope.introOptions.steps = [
            {
                element: '.cabeceraPagina',
                intro: 'Esta seccion controla la gestion de tecnologias, permite crear tecnologias intermedias y tecnologias finales pudiendo gestionar su distribucion. Siempre tendra una raiz como base que se llama "Tecnologias" y de el cuelga toda la distribucion, siendo imposible mover o borrar este nodo.<br> Esta seccion se guarda automaticamente por lo que cualquier cambio repercutira en el resultado que ven los demas.<br>El orden para las tecnologias del mismo nivel sera por orden de entrada y no se podra modificar por nadie.'
            },
            {
                element: '.raiz',
                intro: 'Aqui se encuentra la raiz, a partir de aqui puede construir el arbol que desee.'
            },
            {
                element: '.flechaAyuda',
                intro: 'un icono con forma de flecha situado en la parte izquierda de cada tecnologia permite desplegar u ocultar todas las tecnologias que descienden de esta tecnologia intermedia,si ejecutas este tutorial con  una tecnologia que tenga algo que ocultar tutorial te señalara el punto exacto donde esta ese icono.'
            },
            {
                element: '.hojaAyuda',
                intro: 'Este icono de aqui te permitira añadir tecnologias INTERMEDIAS descendientes inmediatas de la tecnologia intermedia a la que pertenece, nunca encontraras este icono en una tecnoilogia final, ya que estas tecnologias no pueden tener otras tecnologias como descendientes.'
            },
            {
                element: '.nodoAyuda',
                intro: 'Este icono de aqui te permitira añadir tecnologias FINALES descendientes inmediatas de la tecnologia intermedia a la que pertenece, nunca encontraras este icono en una tecnoilogia final, ya que estas tecnologias no pueden tener otras tecnologias como descendientes..'
            },
            {
                element: '.borrarAyuda',
                intro: 'Un icono con forma de equis(X) situado en la parte derecha de cada tecnologia permite eliminar esa tecnologia ,si es una tecnologia final con referencias asociadas a ella no podras eliminarla mientras estas referencias sigan usando esta tecnologia. Si ejecutas este tutorial con  una tecnologia que pueda tener este icono el tutorial te señalara el punto exacto donde se encuentra.'
            },
            {
                element: '#leyendaAyuda',
                intro: 'Aqui se muestra la leyenda de colores para identificar los distintos tipos de tecnologias.'
            },
            {
                element: '#contenedorOpciones',
                intro: 'En esta zona se mostraran los datos de las tecnologias que selecciones.'
            },
            {
                element: '#contenedorOpciones',
                intro: 'podras rellenar o modificar el nombre de las tecnologias intermedias y rellenar o modificar los datos de las tecnologias finales, para que estos cambios se realicen sera imprescindible pulsar en el boton de guardar antes de modificar otra tecnologia.'
            },
            {
                element: '#contenedorOpciones',
                intro: 'En el caso de que sea una tecnologia pendiente de validar aparte del boton de guardar observara un boton para validar la tecnologia.'
            },
            {
                element: '#contenedorOpciones',
                intro: 'Si por el contrario quiere eliminarla tendra que darle al boton rechazar, si observa a la izquierda de este boton un cuadro de texto, antes de pulsar rechazar debera asociar todas las referencias que tiene esta tecnologia a otra tecnologia final que este activa, para hacer esto escriba el nombre de esta tecnologia en el cuadro de texto antes mencionado.Si por el contrario no observa ningun cuadro de texto, puede rechazarla sin mas pulsando en el boton rechazar ya que esto  indica que no hay ninguna referencia asociada a esa tecnologia.'
            }
            ];
    
    //pulsar intro crea  la tecnologia si es posible
    $scope.intro = function (pressEvent){    
        console.log("111");
        if(pressEvent.keyCode == 13){ 
            $scope.guardarElem();   
          }
    };
    
    
}); 
