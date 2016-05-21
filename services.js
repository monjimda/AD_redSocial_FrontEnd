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
			url: url + '/login',
			data: usuario
	   });
	}
    
    function getEsAmigo(nick) {
        
		return llamadaHTTP({
           method: 'GET',
			url: url + '/amigos/' + nick
	   });
	}
    
    function getUsuarioVisitar(nick) {
        
		return llamadaHTTP({
           method: 'GET',
			url: url + '/amigos/visitar/' + nick
	   });
	}
    
    function getPeticionesPendientes() {
        
		return llamadaHTTP({
           method: 'GET',
			url: url + '/amigos/visitar/'
	   });
	}
    
    function enviarPeticion(nick) {
        
		return llamadaHTTP({
           method: 'POST',
			url: url + '/amigos/visitar/',
            data:{nick: nick}
	   });
	}
    
    function aceptarPeticion(nick) {
        
		return llamadaHTTP({
           method: 'POST',
			url: url + '/amigos/visitar/',
            data:{nick: nick}
	   });
	}

    function postImagen(imagen, perfil) {
        var datos={imagen: imagen, perfil:perfil}
        
		return llamadaHTTP({
			method: 'POST',
			url: url + '/usuarios/imagenes',
			data: datos
		});

	}
    
    function getImagen() {
		return llamadaHTTP({
			method: 'GET',
			url: url + '/usuarios/imagenes'
		});

	}
    
    function getPersonas() {
        
		return llamadaHTTP({
			method: 'GET',
			url: url + '/usuarios'
		});

	}

    
    function postUsuario(usuario){
        
       return llamadaHTTP({
			method: 'POST',
			url: url + '/usuario',
			data: usuario
		});

    }
    
    
 
		
	return {
        postUsuario: postUsuario,
        postLogin : postLogin,
        postImagen:postImagen,
        getImagen:getImagen,
        getEsAmigo: getEsAmigo,
        getUsuarioVisitar: getUsuarioVisitar,
        enviarPeticion: enviarPeticion,
        aceptarPeticion: aceptarPeticion,
        getPeticionesPendientes: getPeticionesPendientes,
        getPersonas: getPersonas
	}
}