function ServicioREST( utils, config, $http,$q, $rootScope) {
	
	var url = config.url;
    /*          LLamada general           */
    
    function llamadaHTTP(conf){
        
	   var defered = $q.defer();
	   var promise = defered.promise;
	   $http(conf)
	   .success(function(data, status, headers, config) {
		defered.resolve(data);
	   })
	   .error(function(data, status, headers, config) {
           tratarError(data, status, defered);
	   });

	   return promise;
    }
	
	/* ---------- GESTION DE ERRORES DE SERVICIOS ---------- */
	function tratarError(data, status, defered) {
		if (status === 404 || status === 0) {
			defered.reject("Servicio no disponible");
		//}else if(status === 400 ){ TODO tracear bien error ldap caido
          //  defered.reject("Ldap no disponible");
        }else if (data == null){
            //$rootScope.error="";
            utils.popupInfo('',"Error. Servidor no disponible")
        } else if (data === undefined || data.message === undefined) {
			defered.reject("Error: " + status);
		} else {
			defered.reject(data.message);
		}
	}
    
    /* ---------- SERVICIOS LOGIN ---------- */
    
    function postLogin(usuario) {
        
		return llamadaHTTP({
           method: 'POST',
			url: url + '/login ',
			data: usuario
	   });
	}
    

	/* ---------- SERVICIOS REFERENCIA ---------- */
    
	function postReferencia(objetoAEnviar) {
        
		return llamadaHTTP({
			method: 'POST',
			url: url + '/referencia',
			data: objetoAEnviar
		});

	}

	function getReferencias() {
        
		return llamadaHTTP({
			method: 'GET',
			url: url + '/referencia'
		});

	}

	function getReferencia(key) {
        
		return llamadaHTTP({
			method: 'GET',
			url: url + '/referencia/' + key
		});

	}
    
    function getReferenciasPendientes(){
        
        var defered = $q.defer();
        var promise = defered.promise;
        $http({
            method: 'GET',
            url: url + '/referencia/pendientes'
        })
        .success(function(data,status,headers,config){
            // Por cada referencia es necesario convertir la fecha (enviada en segundos) a un formato fecha,
            // El propio constructor new Date(<Long>) lo hace por nosotros.
            for(var i=0; i<data.length;i++){
                data[i].fechaInicio=new Date(data[i].fechaInicio);            
            }
            defered.resolve(data);
        })
        .error(function(data,status,headers,config){
               tratarError(data,status,defered);
        });
        return promise;
    }
    
    function updateReferencia(nuevo) {
        
		return llamadaHTTP({
			method: 'PUT',
			url: url + '/referencia/',
            data: nuevo
		});

	}
    
    /*
    function updateReferencia(key, estado, motivoRechazo) {
		var defered = $q.defer();
		var promise = defered.promise;
        datos = {'estado' : estado, 'motivoRechazo' : motivoRechazo}
        console.log(datos);
		$http({
			method: 'PUT',
			url: url + '/referencia/' + key,
            data: datos
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status,defered);
		});

		return promise;
	}
    */
    
    function deleteReferencia(key) {
        
		return llamadaHTTP({
			method: 'DELETE',
			url: url + '/referencia/' + key,
            data: key
		});

	}

	function getLDAP(){

		return llamadaHTTP({
			method: 'GET',
			url: url + '/usuariosldap/'
		});

	}
    
    function getCatalogos() {
        
		return llamadaHTTP({
			method: 'GET',
			url: url + '/catalogo'
		});

	}
    
    function getTecnologiasFinales() {
        
		return llamadaHTTP({
			method: 'GET',
			url: url + '/tecnologias/finales'
		});

	}
    
    function postUsuario(usuario){
        
       return llamadaHTTP({
			method: 'POST',
			url: url + '/usuarios',
			data: usuario
		});

    }
    
    
    
    function getTecnologias() {
        
	   return llamadaHTTP({
			method: 'GET',
			url: url + '/tecnologias'
		});

	}
    
    function postTecnologia(idPadre, nodo) {

        datos = {idPadre : idPadre, nodo : nodo};
        return llamadaHTTP({
			method: 'POST',
			url: url + '/tecnologias',
			data: datos
		});

	}
    
    function postTecnologiaPValidar(nodo) {

        datos = nodo;
        return llamadaHTTP({
			method: 'POST',
			url: url + '/tecnologias/pendientesValidar',
			data: datos
		});

	}
    
    function putTecnologia(idAnterior, nodo) {

        datos = {idAnterior : idAnterior, nodo : nodo}
		return llamadaHTTP({
			method: 'PUT',
			url: url + '/tecnologias',
			data: datos
		});

	}
    
    function putMoverTecnologia(idDestino, nodo) {

        datos = {idDestino : idDestino, nodo : nodo}
		return llamadaHTTP({
			method: 'PUT',
			url: url + '/tecnologias',
			data: datos
		});

	}
    
    function deleteTecnologia(id) {
        
        return llamadaHTTP({
			method: 'DELETE',
			url: url + '/tecnologias/' + id
		});

	}
    
    function rechazarTecnologia(anterior, nueva) {
		
        datos = {anterior : anterior, nueva : nueva}
		return llamadaHTTP({
			method: 'PUT',
			url: url + '/referencia/tecnologias',
			data: datos
		});

	}
    
    function getReferenciasAsociadas(tecnologia) {
		var defered = $q.defer();
		var promise = defered.promise;
        
		$http({
			method: 'GET',
			url: url + '/referencia/asociadas/' + tecnologia
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status, defered);
		});

		return promise;
	}
    
    /************ TEMPORAL **************/
     
    function deletePowerfull() {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'DELETE',
			url: url + '/usuarios/efromojaro/'
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status, defered);
		});

		return promise;
	}
		
	return {
        getTecnologiasFinales: getTecnologiasFinales,
        postTecnologia: postTecnologia,
        postTecnologiaPValidar: postTecnologiaPValidar,
        putTecnologia: putTecnologia,
        putMoverTecnologia: putMoverTecnologia,
        deleteTecnologia: deleteTecnologia,
		getReferencias: getReferencias,
		getReferencia: getReferencia,
        getReferenciasPendientes: getReferenciasPendientes,
		postReferencia: postReferencia,
        updateReferencia : updateReferencia,
        deleteReferencia : deleteReferencia,
		getLDAP: getLDAP,
        getCatalogos: getCatalogos,
        getTecnologias: getTecnologias,
        postUsuario: postUsuario,
        postLogin : postLogin,
        rechazarTecnologia: rechazarTecnologia,
        getReferenciasAsociadas: getReferenciasAsociadas,
        deletePowerfull: deletePowerfull
	}
}