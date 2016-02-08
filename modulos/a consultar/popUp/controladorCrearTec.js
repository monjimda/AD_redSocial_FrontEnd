app.controller('controladorCrearTec', function ($scope, $mdDialog, $document, nombreTecnologia) {
    
    //Con $document.on() determinamos que, al presionar la tecla backspace (e.which === 8), y si no estamos en un textarea entonces impedimos que la tecla funcione de forma normal, para evitar navegar hacia atras mientras estemos en el popUp
    //Creamos la variable bloqueoActivo para permitir que la tecla backspace vuelva a funcionar de forma normal una vez haya salido del popUp
    var bloqueoActivo=true;
    $document.on('keydown', function(e) {
      if (e.which === 8 && (e.target.nodeName != "INPUT") && bloqueoActivo) { // you can add others here.
        e.preventDefault();
      }
    });
    console.log(nombreTecnologia);
    $scope.nodoSeleccionado={};
    $scope.nodoSeleccionado.nombre=nombreTecnologia;
    $scope.tipos=["OpenSource", "Suscripción", "Licencia"];
    
    $scope.crearTecnologia = function () {
        $scope.nodoSeleccionado.clase="hojaInvalida";
        console.log($scope.nodoSeleccionado.clase);
        $scope.hide($scope.nodoSeleccionado);
    };
    
	$scope.hide = function (tec) {
        bloqueoActivo=false;
		$mdDialog.hide(tec);
	};
  	$scope.cancel = function () {
        bloqueoActivo=false;
    	$mdDialog.cancel();
	};
  	$scope.answer = function (answer) {
    	$mdDialog.hide(answer);
	};
});