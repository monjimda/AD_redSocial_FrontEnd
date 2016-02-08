function utils($rootScope, $mdDialog){
    
    function popupInfo(ev,descripcion){    
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title("")
            .htmlContent(descripcion)
            .ariaLabel('Alert Dialog Demo')
            .ok('Aceptar')
            .targetEvent(ev)
        );
    }
    
    function cargarMenu(rol){
            if( rol === "ROLE_ADMINISTRADOR"){
                $rootScope.menuTecnologias = true;
                $rootScope.menuGestionTecnologias = true;
                $rootScope.menuUsuarios = true;
                $rootScope.menuUsuariosAlta = true;
                $rootScope.menuUsuariosGestion = true;
                $rootScope.menuReferencias = true;
                $rootScope.menuReferenciasGestion = true;
                $rootScope.menuReferenciasNueva = true;
                $rootScope.menuReferenciasListar = true;
            }else if(rol === "ROLE_VALIDADOR"){
                $rootScope.menuReferencias = true;
                $rootScope.menuReferenciasGestion = true;
                $rootScope.menuReferenciasListar = true;
            }else if(rol === "ROLE_CONSULTOR"){
                $rootScope.menuReferencias = true;
                $rootScope.menuReferenciasListar = true;
            }else if(rol === "ROLE_MANTENIMIENTO"){ 
                $rootScope.menuReferencias = true;
                $rootScope.menuReferenciasGestion = true;
                $rootScope.menuReferenciasListar = true;
                $rootScope.menuReferenciasNueva = true;
            }

            
    }
    
    function isEmptyObject (objeto){
        return angular.equals( {} , objeto );
    };
    
    
    
     return {
         popupInfo: popupInfo,
         cargarMenu: cargarMenu,
         isEmptyObject: isEmptyObject
    }
}