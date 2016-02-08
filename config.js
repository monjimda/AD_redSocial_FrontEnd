app.constant('config', {
	url: "http://localhost:8080/Xonger/api",
	atributoConstante: "esto es una constante",
    introOptions: {
        showStepNumbers: false,
        exitOnOverlayClick: true,
        exitOnEsc: true,
        nextLabel: '<strong>Siguiente</strong>',
        prevLabel: '<span>Anterior</span>',
        skipLabel: 'Cerrar',
        doneLabel: 'Fin'
    }
});
//Configuracion necesaria para la fecha del DatePicker
app.config(function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.firstDayOfWeek = 1;
    $mdDateLocaleProvider.shortDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    $mdDateLocaleProvider.shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      $mdDateLocaleProvider.formatDate = function(date) {
        return date ? moment(date).format('D/M/YYYY') : '';
      };

      $mdDateLocaleProvider.parseDate = function(dateString) {
        var m = moment(dateString, 'D/M/YYYY', true);
        return m.isValid() ? m.toDate() : moment('undefined', 'D/M/YYYY', true).toDate();
      };
});