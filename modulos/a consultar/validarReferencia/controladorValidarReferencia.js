app.controller('controladorValidarReferencia', function(servicioRest,utils, config, $scope, $http,$log, $rootScope,$location,$mdDialog,$interval,$timeout,$route){
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
    
    function inicializarChipsTecnologia(){
        return $rootScope.referenciaCargada.tecnologias.map( function (tec) {
            return {
                value: tec,
                display: tec
            };
        });
   }
    
    if($rootScope.referenciaCargada != null && $rootScope.opcion === 'validar'){
        $scope.clienteCargado = $rootScope.referenciaCargada.cliente;
        $scope.tecnologiasSeleccionadas = inicializarChipsTecnologia(); //angular.copy($rootScope.referenciaCargada.tecnologias);
        $scope.fechaInicio = new Date($rootScope.referenciaCargada.fechaInicio);
        $scope.UserPhoto = $rootScope.referenciaCargada.imagenProyecto;
    }else{
         /*Vaciamos referenciaCargada*/
        $rootScope.referenciaCargada = null;
     }
    
    //---------AYUDA DE LA PAGINA--------
  
    $scope.ayuda = function(){
      $scope.scroll=false
      $scope.lanzarAyuda();
        
    };
    
    $scope.introOptions = config.introOptions;
    

        
    $scope.introOptions.steps = [
        {
            element: '.cabeceraPagina',
            intro: 'Esta es la seccion para validar referencias, las referencias cargadas en esta zona solo pueden ser modificadas por el administrador, el objetivo de esta seccion sera validar o rechazar la referencia cargada.'
        },
        {
            element: '.botonesCrear',
            intro: 'En esta zona estan los botones de rechazar y validar.'
        },
        {
            element: '#rechazar',
            intro: 'Si pulsas en rechazar deberas rellenar un motivo por el que se la rechaza, si, no podras rechazarla.'
        },
        {
            element: '#validar',
            intro: 'Si la referencia esta correcta, solo con pulsar aqui quedara validada.'
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
            cargarDatosValidarReferencia();
        });



    
   
    $scope.codigoQr='';
    $scope.certificado = 'si';
    $scope.mensajeEstado='';
    
    function recargarQR(){
         if($scope.referencia.codigoQr!=''){
             $scope.codigoQr = $scope.referencia.codigoQr;
             $scope.qrCodeVisible=true; 
             
             //Si lo borra que vuelva a ocultar el Qr
         }else if($scope.referencia.codigoQr===''|| $scope.codigoQr===undefined || $scope.codigoQr===' ' || $scope.codigoQr===null){
            $scope.qrCodeVisible=false; 
         }
   }
        
    /* ------------------------ VALIDAR UNA REFERENCIA ------------------------------- */
    
    $scope.validarReferencia = function () {
        $rootScope.referenciaCargada.estado='validada';

        //cambiamos el estado de la referencia a 'validada'
        servicioRest.updateReferencia($rootScope.referenciaCargada)
            .then(function(data) {
                utils.popupInfo('', "Referencia validada con éxito.");
                 //Redireccionamos al usuario a la ventana de listar Referencias Pendientes de Validar
                $location.path('/listarReferencia');
                console.log("Referencia validada");
                /*Vaciamos referenciaCargada*/
                $rootScope.referenciaCargada = null;
            }).catch(function(err) {
                utils.popupInfo('',"Error al validar la referencia.");
                console.log("Error al validar la referencia");
            });  
    }
    
    /* ------------------------ RECHAZAR UNA REFERENCIA ------------------------------- */
    
    $scope.rechazarReferencia = function () {
        $rootScope.referenciaCargada.estado='borrador';
        
        rechazarRefPopUp(event)
        
        //cambiamos el estado de la referencia a 'borrador'
        
    }
    
    rechazarRefPopUp = function(ev) {
        $mdDialog.show({
            controller: 'controladorRechazarReferencia',
            templateUrl: 'modulos/popUp/rechazarReferencia.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false
        })
        .then(function(razonRechazo) {
                servicioRest.updateReferencia($rootScope.referenciaCargada)
                .then(function(data) {
                    utils.popupInfo('', "Referencia rechazada, se avisará al responsable.");
                    //Redireccionamos al usuario a la ventana de listar Referencias Pendientes de Validar
                    $location.path('/listarReferencia');
                    console.log("Referencia rechazada");
                    /*Vaciamos referenciaCargada*/
                    $rootScope.referenciaCargada = null;
                }).catch(function(err) {
                    utils.popupInfo('',"Error al rechazar la referencia.");
                    console.log("Error al rechazar la referencia");
                });  
            })
        .catch(function(err) {
                utils.popupInfo('',"Error al rechazar la referencia.");
                console.log("Error al rechazar la referencia");
            });
    };
    

   /*-----------------------  Cargar datos en validarReferencia ----------------------- */
    function cargarDatosValidarReferencia(){
        // este codigo rellena la referencia con la informacion guardada en $rootScope
        //$scope.referencia = {};
        $scope.referencia=$rootScope.referenciaCargada;
        $scope.fechaInicio = new Date($rootScope.referenciaCargada.fechaInicio);
        $scope.sociedadSeleccionado = $rootScope.referenciaCargada.sociedad;
        $scope.sectorEmpresarialSeleccionado = $rootScope.referenciaCargada.sectorEmpresarial;
        $scope.tipoActividadSeleccionado = $rootScope.referenciaCargada.tipoActividad;
        $scope.tipoProyectoSeleccionado = $rootScope.referenciaCargada.tipoProyecto;
        $scope.regPedidoAsociadoReferencia = $rootScope.referenciaCargada.regPedidoAsociadoReferencia;
        $scope.responsableComercialSeleccionado = $rootScope.referenciaCargada.responsableComercial;
        $scope.responsableTecnicoSeleccionado = $rootScope.referenciaCargada.responsableTecnico;
        $scope.valorQr = true;
        $scope.referencia.codigoQr = $rootScope.referenciaCargada.codigoQr;
        recargarQR();
    }
});

