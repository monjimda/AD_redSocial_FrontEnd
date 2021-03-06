'use strict';
var app = angular.module('ref', ['ngRoute','ngMaterial','ngMdIcons','ngMessages','ja.qr','ui.bootstrap','angular-intro','ui.tree','ngSanitize']);



app.run(function(servicioRest, utils, $rootScope, $http, $location, $mdDialog) {
    
    $rootScope.menu=false;
    // Opcion que determinará desde donde se accede a la pagina de nuevaReferencia para saber que cabecera y botones ponerle.
    $rootScope.actualizarTitulo = function(){
        $rootScope.opcion = 'nueva'; 
    };
    
	// Establecemos las cabeceras por defecto. Las cabecera Authorization se modificara cuando el usuario se loge
	$http.defaults.headers.common['Accept'] = 'application/json, text/javascript';
	$http.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    
    
    
    // Comprobamos si el usuario guardó información en el localStorage. Si es asi la cargamos
	if (localStorage.getItem("nick") !== null ||  sessionStorage.getItem("nick") !== null) {
        
        //Cargamos los datos del storage pertinente. No van a estarlos dos a la vez
        if(localStorage.getItem("nick") !== null){

            caragaStorage(localStorage);
        }
        
        if(sessionStorage.getItem("nick") !== null){

            caragaStorage(sessionStorage);
        }
        //volvemos a cargar el menú
        $rootScope.menu = true;

        $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa($rootScope.usuarioLS.nick + ':' + $rootScope.usuarioLS.password);

        // Hacemos la llamada al servicioRest pidiendole los datos del usuario
        servicioRest.postLogin({nick:$rootScope.usuarioLS.nick ,password: $rootScope.usuarioLS.password})
        .then(function(data) {
            data.role=$rootScope.usuarioLS.role;
            // esta funcion permite cargar el menu cuando hemos recargado la pagina
            utils.cargarMenu(data.role);

        })
        .catch(function(err) {
            // Debemos tratar el error   


        }); 
	}
   
    
    
    
    $rootScope.datosUsuarioLogueado = function() {
     
        $mdDialog.show({
         
          templateUrl: 'modulos/popUp/usuarioLogueado.html',
          parent: angular.element(document.body),
          clickOutsideToClose:true
        })
    };
    function caragaStorage(storage){

        $rootScope.usuarioLS = {
            nick: storage.getItem("nick"),
            password: Aes.Ctr.decrypt(storage.getItem("password"), storage.getItem("nick"), 256),
            role: storage.getItem("role"),
            name: storage.getItem("name")
        };   
    }
    
    
    $rootScope.salir = function() {
        $rootScope.usuarioLS="";
        limpiarStorage(localStorage);
        limpiarStorage(sessionStorage);
        $http.defaults.headers.common.Authorization = 'Basic ';
        $rootScope.usuarioLS = undefined;
        $location.path('/');
        // Ocultamos el menú
        $rootScope.menu=false;
        $rootScope.menuReferencias = false;
        $rootScope.menuReferenciasNueva = false;
        $rootScope.menuReferenciasGestion = false;
        $rootScope.menuReferenciasListar = false;
        $rootScope.menuUsuarios = false;
        $rootScope.menuUsuariosAlta = false;
        $rootScope.menuUsuariosGestion = false;
        $rootScope.menuTecnologias = false;
        $rootScope.menuGestionTecnologias = false;
        $rootScope.referenciaCargada = null;
    }
    
    function limpiarStorage(storage) {

        
        // Limpiamos el localStorage
        storage.clear();
        storage.removeItem("name");
        storage.removeItem("password");
        storage.removeItem("role");
        // Limpiamos las cabeceras de autenticación
        
    }

    // Redirige a la pagina de Login si no estas logeado
    $rootScope.$on('$locationChangeStart', function(event, next, current) {

        if ($rootScope.usuarioLS===undefined || $rootScope.usuarioLS === {}) {
            $location.path('/');
        }
    });

    
});

app.config(function($routeProvider) {

	$routeProvider
    .when('/', {
		templateUrl: 'modulos/login/login.html',
        controller: 'controladorLogin'
	})
    .when('/alta', {
        templateUrl: 'modulos/altaUsuario/altaUsuario.html',
        controller: 'controladorAltaUsuario'
    })
    .when('/buscarReferencias', {
        templateUrl: 'modulos/buscarReferencias/buscarReferencias.html',
        controller: 'controladorBuscarReferencias'
    })
    .when('/nueva', {
        templateUrl: 'modulos/nuevaReferencia/nuevaReferencia.html',
        controller: 'controladorNuevaReferencia'
    })
    .when('/validarReferencia', {
        templateUrl: 'modulos/validarReferencia/validarReferencia.html',
        controller: 'controladorValidarReferencia'
    })
    .when('/modificarReferencia', {
        templateUrl: 'modulos/modificarReferencia/modificarReferencia.html',
        controller: 'controladorModificarReferencia'
    })
    .when('/listarReferenciasValidar', {
        templateUrl: 'modulos/listarReferenciasValidar/listarReferenciasValidar.html',
        controller: 'controladorListarReferenciasValidar'
    })
    .when('/bienvenida', {
        templateUrl: 'modulos/bienvenida/bienvenida.html',
        controller: 'controladorBienvenida'
    })
    .when('/gestionTecnologias', {
        templateUrl: 'modulos/gestionTecnologias/gestionTecnologias.html',
        controller: 'controladorGestionTecnologias'
    })
	.when('/pageNotFound', {
		templateUrl: 'modulos/error/templateError.html'
	})
	.otherwise({
		redirectTo: "/pageNotFound"
	});
});



app.service('utils', utils);

//Incluimos el servicio ServicioRest. Nocesitamos meter las dependencias que usa para que espere a que confid y utils se carguen
app.service('servicioRest', ['utils', 'config', '$http','$q', '$rootScope' ,ServicioREST])



