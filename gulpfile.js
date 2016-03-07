/*
* Dependencias
*/
var gulp = require('gulp'),
connect = require('gulp-connect');



gulp.task('default', ['info']);

gulp.task('server', function() {
	console.log("Arrancamos el server");
	connect.server({
		port: 80,
		root: './',
		livereload: true,
	});
});