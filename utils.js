function utils($rootScope, $mdDialog){
    
    function popupInfo(descripcion){    
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title("")
            .htmlContent(descripcion)
            .ariaLabel('Alert Dialog Demo')
            .ok('Aceptar')
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
            }else if(rol === "ROLE_USER"){
                $rootScope.menuReferencias = true;
                $rootScope.menuReferenciasGestion = true;
                $rootScope.menuReferenciasListar = true;
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