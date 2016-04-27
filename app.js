'use strict';
var app = angular.module('ref', ['ngRoute','ngMaterial','ngMdIcons','ngMessages','ja.qr','ui.bootstrap','angular-intro','ui.tree','ngSanitize']);


app.controller('controladorMenu', function(){
    console.log("HOLAA");
    var self = this;

    self.simulateQuery = false;
    self.isDisabled    = false;

    // list of `state` value/display objects
    self.states        = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;

    self.newState = newState;

    function newState(state) {
      alert("Sorry! You'll need to create a Constituion for " + state + " first!");
    }

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
      console.log("texto");
        console.log(text);
    }

    function selectedItemChange(item) {
      console.log("item");
        console.log(item);
    }

    /**
     * Build `states` list of key/value pairs
     */
    function loadAll() {
      var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';

      return allStates.split(/, +/g).map( function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }
});



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
            //$location.path('/'); //TODO: VOLVER A PONER ESTA MIERDA ACTIVA
        }
    });

    
});

app.config(function($routeProvider) {

	$routeProvider
    .when('/', {
		templateUrl: 'modulos/login/login.html',
        controller: 'controladorLogin'
	})
    .when('/registro', {
        templateUrl: 'modulos/registro/registro.html',
        controller: 'controladorRegistro'
    })
    .when('/inicio', {
        templateUrl: 'modulos/inicio/inicio.html',
        controller: 'controladorInicio'
    })
    .when('/perfil', {
        templateUrl: 'modulos/perfil/perfil.html',
        controller: 'controladorPerfil'
    })
    .when('/fotos', {
        templateUrl: 'modulos/perfil/perfil.html',
        controller: 'controladorPerfil'
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



