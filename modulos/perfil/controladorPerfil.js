app.controller('controladorPerfil', function(servicioRest, config, $scope, $http, $location, $rootScope, $mdDialog) {
    document.getElementById("fotoPerfil").setAttribute('src',"http://www.zuliapordentro.com/wp-content/uploads/2016/02/new-google-logo.jpg");
    $scope.prueba="http://www.zuliapordentro.com/wp-content/uploads/2016/02/new-google-logo.jpg";
    var reader=new FileReader();
    $scope.hola=function(){
        
        
        var reader = new FileReader();
            reader.onload = function (e) {
                $scope.prueba=e.target.result;
                //img.src.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
                document.getElementById("fotoPerfil").setAttribute('src', e.target.result);
};
            reader.readAsDataURL(document.getElementById("botonFileReal").files[0]);
        
    }
    $scope.subirFoto = function (){
        console.log("hola");
        document.getElementById('botonFileReal').click();//.then({
            //console.log("hola");
            //document.getElementById("fotoPerfil").setAttribute("src",$scope.referencia.imagenProyecto)
        //});
        
    }
    //$scope.prueba="http://www.doralnewsonline.com/doralfinal/wp-content/uploads/2015/10/new-and-old-google-logos.jpg";
    
    /*------------------- PROYECTO DEMO DE CHAT CON WEBSOCKETS https://github.com/socketio/socket.io/tree/master/examples/chat -------------------*/
});