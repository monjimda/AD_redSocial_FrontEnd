app.controller('controladorNuevaReferencia', function(servicioRest,utils, config, $scope, $http,$log, $rootScope,$location,$mdDialog,$interval,$timeout,$route){
    //--------------------- Objetos del controlador (clientes y tecnologias)

    //Se obtienen los elementos que tengan la clase "md-datepicker-input" se obtiene el primer elemento (solo hay uno)
    //y le añades el atributo "readonly" a true. Esto se hace porque el datepicker crea este elemento en ejecucion
    //y no puedes establecer este atributo a mano en el html, debes añadirlo dinamicamente en ejecucion,
    //que es el momento en el que se crea el elemento
    
    document.getElementsByClassName("md-datepicker-input")[0].setAttribute("readonly","true");
    //clienteReferencia.focus();
    $scope.tecnologiasSeleccionadas=[];
    // list of `state` value/display objects
    $scope.clientes={
        lista:[],
        texto:'',
        elemSelecionado:{}
    };
    $scope.tecnologias={
        lista:[],
        texto:'',
        elemSelecionado:{}
    };
    
    $scope.activarScroll=function(){     
        $scope.scroll=true;     
    };

      
    //Habilitar/deshabilitar los campos del formulario
    $scope.deshabilitarForm=false;
    
    //mostramos los botones de crear referencia 
    $scope.mostrarBtCrear=true;

    //Como no conocemos los datos que tendrá la refrencia pero queremos poner valores por defecto,
    //la asignamos un objeto vacío al que le metemos los valores por defecto

    $scope.referencia={}
    
    //inicializamos el valor del certificado a 'si' para que salga esa opción seleccionada por defecto
    $scope.referencia.certificado='si';
     
    //Objeto con todos los mensajes errores de validación en la entrada de datos a través de los campos
    //Se guardan en un objeto porque JS no acepta arrays asociativos
    erroresTotales={};
    //Le metemos los valores usando como clave el atributo 'name' del elemente html que lo recoge
    erroresTotales['cliente']="Cliente inválido";
    erroresTotales['sociedad']="Se debe seleccionar una sociedad";
    erroresTotales['SectorEmp']="Se debe seleccionar un sector empresarial";
    erroresTotales['tActividad']="Se debe seleccionar un tipo de actividad";
    erroresTotales['tProyecto']="Se debe seleccionar un tipo de proyecto";

    erroresTotales['fecha']="Se debe seleccionar una fecha de inicio";

    erroresTotales['duracion']="Se debe seleccionar una duración en meses mínima de 1 mes";
    erroresTotales['denominacion']="El campo denominación no puede estar vacío ni superar el límite de caracteres";

    erroresTotales['Rproyecto']="El campo resumen del proyecto no puede estar vacío ni superar el límite de caracteres";
    erroresTotales['ProblemaCliente']="El campo problemática del cliente no puede estar vacío ni superar el límite de caracteres";

    erroresTotales['solGFI']="El campo Solución GFI no puede estar vacío ni superar el límite de caracteres";
    
    erroresTotales['fteTotal']="Se debe seleccionar una cantidad de FTE totales mínima de 1 FTE";

    //$scope.errores['registroPedido']="El campo de registros asociados no puede estar vacío";

    erroresTotales['rbleComercial']="Se debe seleccionar un responsable comercial";

    erroresTotales['rbleTecnico']="Se debe seleccionar un responsable técnico";

    erroresTotales['userfile']="Se debe subir una imágen";
    erroresTotales['tecnologia']="Tecnología inválida";
    
    $rootScope.referenciaCargada = null;
        
    //---------AYUDA DE LA PAGINA--------
  
    $scope.ayuda = function(){
      $scope.scroll=false
      $scope.lanzarAyuda();
        
    };
    
    $scope.introOptions = config.introOptions;
    

    $scope.introOptions.steps = [
            {
                element: '.md-dialog-content',
                intro: 'Debe seleccionar un cliente valido de la lista disponible. La lista se mostrara a partir de la tercera letra escrita. <br/> Para guardar en borrador no sera necesario la validez de este cliente, pero si escribe algo invalido en este campo,  al guarda como borrador el cliente se guardara vacio como si no hubiera escrito nada.'
            },
            {
                element: '#sociedad',
                intro: 'Seleccione una sociedad de la lista disponible, si no encuentra la que busca consulte con su gerente.'
            },
            {
                element: '#sectorEmpresarial',
                intro: 'Seleccione un Sector empresarial de la lista disponible, si no encuentra el que busca consulte con su gerente.'
            },
            {
                element: '#actividad',
                intro: 'Seleccione una actividad de la lista disponible, si no encuentra la que busca consulte con su gerente.'
            },
            {
                element: '#tipoProyecto',
                intro: 'Seleccione un tipo de proyecto de la lista disponible, si no encuentra el que busca consulte con su gerente.'
            },
            {
                element: '#fecha',
                intro: 'Seleccione una fecha o escribala con el siguiente formato DD/MM/AAAA.'
            },
            {
                element: '#duracion',
                intro: 'Este campo debe rellenarse con la duracion del proyeccto en meses con un minimo de un mes.'
            },
            {
                element: '#denominacion',
                intro: 'Escriba aqui un nombre que identifique y defina el proyecto.'
            }, 
            {
                element: '#resumen',
                intro: 'En este campo debe escribirse un resumen del alcance del proyecto.'
            },
            {
                element: '#problematica',
                intro: 'Debe rellenar este campo con una definicion detallada del problema que tiene el cliente.'
            },
            {
                element: '#solucion',
                intro: 'Debe rellenar este campo con la solucion optada por GFI para solucionar la problematica del cliente.'
            },
            {
                element: '#fte',
                intro: 'Numero de horas empleadas en el proyecto con un minimo de 1.'
            },
            {
                element: '#certificado',
                intro: 'Seleccione si el proyecto tiene un certificado.'
            },
            {
                element: '#comercial',
                intro: 'Gerente encargado de la parte comercial del proyecto.'
            },
            {
                element: '#tecnico',
                intro: 'Gerente encargado de la parte tecnica del proyecto.'
            },
            {
                element: '#imagen',
                intro: 'Debe pulsar aqui para subir una imagen del proyecto.'
            },
            {
                element: '#qrCode',
                intro: 'En este campo se añadira una url para ponerla en el proyecto como un codigo QR.'
            },
            {
                element: '#tecnologias',
                intro: 'Debe seleccionar una o varias tecnologias validas de la lista disponible. La lista se mostrara a partir de la segunda letra escrita. <br/> Si la tecnologia que usted desea añadir no esta, puede añadirla, para esto siga las siguientes intrucciones:'
            },
            {
                element: '#tecnologias',
                intro: 'Escriba la tecnologia que desea dar de alta, luego pulse intro, etso le abrira un menu donde puede rellenar los datos de la tecnologia, si lo hace hasta el final  y pulsa en guardar la tecnologia sera añadida a la referencia, si no, se borrara del campo tecnologia.'
            },
            {
                element: '#borrador',
                intro: 'Al pulsar en este boton guarda la referencia en estado borrador, lo que implica que no todos los campos tienen que star rellenos y los campos invalidos simplemente no se guardaran.'
            },
            {
                element: '#terminar',
                intro: 'Si pulsa en terminar, debera tener todos los campos obligatorios (aquellos que tienen asteriscos) rellenos y de forma correcta, si esto no es asi saltara un mensaje que le indicara los errores para que pueda solucionarlos, cuando todo este correcto podra guardar la referencia para que la validen.'
            }
            ];

    setTimeout(function(){ 
            //Se necesita un tiem out para dar tiempo a que se cargue el lanzar ayuda
            $rootScope.lanzarAyuda=$scope.ayuda;
        }, 1000)
    
    /* ----------------------- CARGA DE CATALOGOS ------------------------*/
    $scope.catalogo={};
    $scope.title = "";
    $scope.descripcion = "";
    var j = 0, counter = 0;
    $scope.activado = $scope.activated;
    servicioRest.getCatalogos().then(
        function(response) {
            $scope.catalogo = response;
            $rootScope.clientes = $scope.catalogo.clientes;
            //$rootScope.tecnologias = $scope.catalogo.tecnologia;
       
            cargarDatosClientes();
            //cargarDatosTecnologias();
            
            $rootScope.sociedades = $scope.catalogo.sociedades;
            
            // si venimos de listar referencias tendremos una referencia cargada en $rootScope para la comunicacion entre los controladores
            if($rootScope.referenciaCargada != null){               
                cargarDatosValidarReferencia();
            }else{
                $scope.valorQr = false;
            }
        });
    
    servicioRest.getTecnologiasFinales().then(
        function(response) {
            $scope.tecnologias.lista = response;
            //cargarTecnologias($scope.tecnologias.lista);
            cargarDatosTecnologias(response);
        });
    
    
    
    
    /*-----------------------  AUTOCOMPLETE ----------------------- */
    
    //filtramos los datos del autocomplete según el texto
    $scope.filtrar = function (texto, campo) {
        var resultado;
        var array;
        // Determinamos cual es el array a filtrar y cuanl es el índice del resultado
        if(campo==='cliente'){
            
            array=$scope.clientes.lista;
            $scope.posicionEnArray=undefined;
        }
        else if (campo==='tecnologia'){
            array=$scope.tecnologias.lista;
            $scope.posicionEnArray2=undefined;
        }
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
    
    //Cuando seleccionamos un elemento de la lista de resultados del autocomplete
    $scope.selectedItemChange=function (item, campo) {
        
        if(campo==='cliente'){
            //si es el autocomplete del cliente, buscamos el índife en la lista de clientes.
            //lo asignamos a la posición del catálogo de clientes correspondiente al mismo
            $scope.posicionEnArray=$scope.clientes.lista.indexOf(item);     
        }else if(campo==='tecnologia'){
            //si es el autocomplete del tecnologñia, buscamos el índice en la lista de tecnologías.
            //lo asignamos a la posición del catálogo de clientes correspondiente al mismo
            
            $scope.posicionEnArray2=$scope.tecnologias.lista.indexOf(item);
        }
    }
    
    //cargamos los datos de los clientes y las tecnologías en los datos de los autocompleter correspondientes con estas funciones 
    function cargarDatosClientes() {
         $scope.clientes.lista= $rootScope.clientes.map( function (cliente) {
            return {
                value: cliente.nombre,
                display: cliente.nombre+' ('+cliente.siglas+')'
            };
        });
        //cargamos los datos en el autocomplete a través del controlador          
    }
    
    // TODO: BORRAR SI SE DEMUESTRA QUE ES INUTIL
    function cargarDatosTecnologias(listaTecnologias) {
        console.log(listaTecnologias);
        $scope.tecnologias.lista= listaTecnologias.map( function (tec) {
            return {
                value: tec.nombre,
                display: tec.nombre
            };
        });
        //cargamos los datos en el autocomplete a través del controlador          
    }
    
    function existeChip (nombreChip){
        var encontrado=false;
        for(var i=0; i<$scope.tecnologias.lista.length; i++){
            if($scope.tecnologias.lista[i].display===nombreChip){
                encontrado=true;
            }
        }
        console.log(encontrado);
        return encontrado;
    }

    $scope.transformChip = function (chip) {
      if (angular.isObject(chip)) {
        return chip;
      }
        else if(!existeChip(chip)){
            anadirTecPopUp(event, chip);
        }

        console.log($scope.tecnologias.lista);
      return { value: chip, display: chip };
        //return null;
    }
    
    anadirTecPopUp = function(ev, nombreTec) {
        $mdDialog.show({
            locals: {
                nombreTecnologia: nombreTec
            },
            controller: 'controladorCrearTec',
            templateUrl: 'modulos/popUp/crearTec.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
        .then(function(nuevaTecnologia) {
            servicioRest.postTecnologiaPValidar(nuevaTecnologia)
            .then(function(data){
                utils.popupInfo('', "Tecnologia creada con exito");
                servicioRest.getTecnologiasFinales().then(
                function(response) {
                    $scope.tecnologias.lista = response;
                    cargarDatosTecnologias(response);
                });
            })
            .catch(function(data){
                utils.popupInfo('', 'Error al crear la tecnologia');
                $scope.tecnologiasSeleccionadas.splice($scope.tecnologiasSeleccionadas.length-1);
            });
        })
        .catch(function(err) {
            utils.popupInfo('', 'No se ha agregado la tecnologia');
            $scope.tecnologiasSeleccionadas.splice($scope.tecnologiasSeleccionadas.length-1);
        });
    };
 
    
    //-----------------------------------------------CREACIÓN---------------------------------------------------------------------
    
    $scope.uploadFile = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                //Sets the Old Image to new New Image
                document.getElementById('photo-id').src= e.target.result;

                //Create a canvas and draw image on Client Side to get the byte[] equivalent
                var canvas = document.createElement("canvas");
                var imageElement = document.createElement("img");

                imageElement.setAttribute('src', e.target.result);
                canvas.width = 50;
                canvas.height = 50;
                var context = canvas.getContext("2d");
                context.drawImage(imageElement, 0, 0);
                $scope.base64Image = canvas.toDataURL("image/jpeg");

                //Removes the Data Type Prefix 
                //And set the view model to the new value
                $scope.base64Image = $scope.base64Image.replace(/data:image\/jpeg;base64,/g, '');
            }

            //Renders Image on Page
            reader.readAsDataURL(input.files[0]);
        }
    }
            
    /* ---------------  MOSTRAR QR CUANDO COMPLETA EL CAMPO  --------------*/    
    $scope.codigoQr='';
    $scope.QrChaged = function (){
       recargarQR();
    }
   function recargarQR(){
         if($scope.referencia.codigoQr!=''){
             $scope.codigoQr = $scope.referencia.codigoQr;
             $scope.qrCodeVisible=true; 
             
             //Si lo borra que vuelva a ocultar el Qr
         }else if($scope.referencia.codigoQr===''|| $scope.codigoQr===undefined || $scope.codigoQr===' ' || $scope.codigoQr===null){
            $scope.qrCodeVisible=false; 
         }
   }
    $scope.certificado = 'si';
    $scope.mensajeEstado='';
    
    
//--------------- Sección de validación de campos en nueva referencia --------------------------------------------
    
    
    
    //Por defecto, todos los campos están mal. Así que asignamos todos los errores al array
    var erroresCometidos=Object.keys(erroresTotales);
    
    //actualizamos la lista de errores
    $scope.actualizaErrores=function(elem, error){
        var indice = erroresCometidos.indexOf(elem);
        
        if(utils.isEmptyObject(error)){//<-- Si el campo está mal
            //Si el error segue en la lista, lo eliminamos  
            if (indice >= 0) {
                erroresCometidos.splice(indice, 1);
            }
        }
        else{ //<-- Si el campo está bien
            //Si el error había sido eliminado de la lista, lo insertamos
            if (indice < 0) {
                erroresCometidos.push(elem);
            }
        }
    };
    
    function listarErrores(){
        
        var result=[];
        for (var i=0;i<erroresCometidos.length; i++){
            result.push(erroresTotales[erroresCometidos[i]]);
        }
        return result;
    }
    
    
    function validarCampos(){
        //Como los siguientes campos no los validar automñaticamente, los evaluamos aquí y actualizamos el array de errores
        compruebaCampo($scope.posicionEnArray, 'cliente');
        aux = $scope.tecnologiasSeleccionadas.length;
        if($scope.tecnologiasSeleccionadas.length>0){
            if(erroresCometidos.indexOf('tecnologia')>=0){
            erroresCometidos.splice(erroresCometidos.indexOf('tecnologia'), 1);
            }
        }else{
            if(erroresCometidos.indexOf('tecnologia')<0){
            erroresCometidos.push('tecnologia');
            }
        }
        //Es necesario comprobar aqui los errores de fteTotales y duracionMeses poruqe en mozilla no sale automatico.(en chrome y explorer si)
        
        if($scope.referencia.duracionMeses!=null && $scope.referencia.duracionMeses>0){
            if(erroresCometidos.indexOf('duracion')>=0){
            erroresCometidos.splice(erroresCometidos.indexOf('duracion'), 1);
            }
        }else{
            if(erroresCometidos.indexOf('duracion')<0){
            erroresCometidos.push('duracion');
            }
        }
        if($scope.referencia.fteTotales!=null && $scope.referencia.fteTotales>0){
            if(erroresCometidos.indexOf('fteTotal')>=0){
            erroresCometidos.splice(erroresCometidos.indexOf('fteTotal'), 1);
            }
        }else{
            if(erroresCometidos.indexOf('fteTotal')<0){
            erroresCometidos.push('fteTotal');
            }
        }
        compruebaCampo($scope.referencia.fechaInicio, 'fecha');
        
        //Los campos serán válidos cuando no tengamos errorres en los campos obligatorios. Por lo que comparamos con la longitud del array de errores
        return 0===erroresCometidos.length;    
    }
    
    function compruebaCampo(campo, id_error){
        
        var indice=erroresCometidos.indexOf(id_error);
        //las posiciones en los arrays serán -1 en caso de que no haya error y la fecha será undefined o null
        if(undefined!=campo && -1!==campo){//<-- Si el campo está bien
            //Si el error había sido eliminado de la lista, lo insertamos  
            if (indice >= 0) {
                erroresCometidos.splice(indice, 1);
            }
        }
        else{ //<-- Si el campo está mal
            //Si el error sigue en la lista, lo eliminamos
            if (indice < 0) {
                erroresCometidos.push(id_error);
            }
        }
            
    }

 //--------------------------------------------------------------------------------------------------------------------------   
    /* CREAR la referencia, puede tener estado: pendiente/borrador  */

    //por reutilización se llamará a esta función cuando se quiera mandar la refrencia a crear al back
    function enviarReferencia(referencia, mensajeEstado){
        servicioRest.postReferencia(referencia)
        .then(function(data){
            utils.popupInfo('', mensajeEstado);
            $route.reload();
        })
        .catch(function(data){
            utils.popupInfo('', 'Error al crear la referencia');
        });
    }
    
    $scope.crearReferencia = function (estado, event) {
        if ((estado==="pendiente" && validarCampos()) || estado==="borrador")
        {
            // Crea/Guarda una referencia dependiendo de su estado
            if(undefined!=$scope.posicionEnArray){
                $scope.referencia.cliente = $scope.catalogo.clientes[$scope.posicionEnArray].nombre;
            }
                      
            
            
            if(undefined!=$scope.tecnologiasSeleccionadas){
                var arrayAux=[];
                for(var i=0;i<$scope.tecnologiasSeleccionadas.length;i++)
                {
                    arrayAux.push($scope.tecnologiasSeleccionadas[i].value);
                }
                $scope.referencia.tecnologias = arrayAux;
                
            }
                
            $scope.referencia.creadorReferencia = $rootScope.usuarioLS.name;
            
            if(undefined!=$scope.referencia.regPedidoAsociadoReferencia){
                //TODO
                //$scope.referencia.regPedidoAsociadoReferencia = $scope.referencia.regPedidoAsociadoReferencia.split(/,[ ]*/);
                $scope.referencia.regPedidoAsociadoReferencia = [];
            }else{
                
                $scope.referencia.regPedidoAsociadoReferencia = [];
            }
            var fileReader = new FileReader();
            
            if(undefined!=document.getElementById("botonFileReal").files[0]){
                
                var imagen = document.getElementById("botonFileReal").files[0];
                fileReader.readAsBinaryString(imagen);
                fileReader.onloadend = function(e)
                {
                    var objeto = e.target.result;
                    objeto = btoa(objeto);
                    $scope.referencia.imagenProyecto = objeto;
                    var referencia = $scope.referencia;
                    
                    $scope.referencia.estado = estado; 
                    if(estado==="pendiente")
                    {
                        mensajeEstado='Referencia creada pendiente de validar.'; 
                    }
                    else if(estado==="borrador")
                    {
                        mensajeEstado='Referencia creada en modo borrador.'; 
                    }
                    enviarReferencia(referencia, mensajeEstado);
                 }
            }else
            {
                    var referencia = $scope.referencia;
                    $scope.referencia.estado = estado; 
                    if(estado==="pendiente")
                    {
                        mensajeEstado='Referencia creada pendiente de validar.'; 
                    }
                    else if(estado==="borrador")
                    {
                        mensajeEstado='Referencia creada en modo borrador.';
                    }
                    enviarReferencia(referencia, mensajeEstado);
            }
            
        }else{
            errores(event,listarErrores());
        }
                

    }
    
    errores = function(ev, listaErr) {
        $mdDialog.show({
            locals: {
                listaErrores: listaErr
            },
            controller: 'controladorErroresReferencia',
            templateUrl: 'modulos/popUp/erroresReferencia.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
    };
});

