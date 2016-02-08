app.controller('controladorRechazarReferencia', function ($scope, $mdDialog, $document) {
    
    //Con $document.on() determinamos que, al presionar la tecla backspace (e.which === 8), y si no estamos en un textarea entonces impedimos que la tecla funcione de forma normal, para evitar navegar hacia atras mientras estemos en el popUp
    //Creamos la variable bloqueoActivo para permitir que la tecla backspace vuelva a funcionar de forma normal una vez haya salido del popUp
    var bloqueoActivo=true;
    $document.on('keydown', function(e) {
      if (e.which === 8 && (e.target.nodeName != "TEXTAREA") && bloqueoActivo) { // you can add others here.
        e.preventDefault();
      }
    });
    
    $scope.rechazarReferencia = function () {
        if($scope.motivoRechazo==="" || $scope.motivoRechazo===undefined){
            $scope.hayError=true;
            //$scope.useForm.motivoRechazo.$error;
        }
        else{
            $scope.hide($scope.motivoRechazo);
        }
    };
    
	$scope.hide = function (razonRechazo) {
        bloqueoActivo=false;
		$mdDialog.hide(razonRechazo);
	};
  	$scope.cancel = function () {
        bloqueoActivo=false;
    	$mdDialog.cancel();
	};
  	$scope.answer = function (answer) {
    	$mdDialog.hide(answer);
	};
});