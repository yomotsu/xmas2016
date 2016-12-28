'use strict';

const browserSync  = require( 'browser-sync' ).create();

const browserify   = require( 'browserify' );
const babelify     = require( 'babelify' );
const source       = require( 'vinyl-source-stream' );
const buffer       = require( 'vinyl-buffer' );

const postcss      = require( 'gulp-postcss' );
const autoprefixer = require( 'autoprefixer' );
const csswring     = require( 'csswring' );

const gulp         = require( 'gulp' );
const gulpif       = require( 'gulp-if' );
const plumber      = require( 'gulp-plumber' );
const rename       = require( 'gulp-rename' );
const sass         = require( 'gulp-sass' );
const uglify       = require( 'gulp-uglify' );
const runSequence  = require( 'run-sequence' ).use( gulp );

const AUTOPREFIXER_BROWSERS = {
	browsers: [
		'ie >= 11',
		'safari >= 8',
		'ios >= 8',
		'android >= 4'
	]
};

let production = false;

gulp.task( 'browser-sync', () => {

	browserSync.init( {
		server: {
			baseDir: './',
			directory: true
		},
		startPath: './'
	} );

} );


gulp.task( 'sass', () => {

	var processors = [
		autoprefixer( AUTOPREFIXER_BROWSERS ),
		csswring
	];

	return gulp.src( './src/scss/main.scss' )
	.pipe( plumber( {
		errorHandler: ( err ) => {

			console.log( err.messageFormatted );
			this.emit( 'end' );

		}
	} ) )
	.pipe( sass() )
	.pipe( gulp.dest( './build/css/' ) )
	.pipe( rename( { extname: '.min.css' } ) )
	.pipe( postcss( processors ) )
	.pipe( gulp.dest( './build/css/' ) );

} );


gulp.task( 'browserify', () => {

	return browserify( {
		entries: './src/js/main.js'
	} )
	.transform( babelify.configure( {
		presets: [ [ 'es2015', { 'loose' : true } ] ],
		plugins: [
			// 'add-module-exports',
			// for IE9
			// see https://gist.github.com/zertosh/4f818163e4d68d58c0fa
			'transform-proto-to-assign',
			// 'transform-object-assign'
		]
	} ) )
	.bundle()
	.on( 'error', ( err ) => {

		console.log( 'Error : ' + err.message );

	} )
	.pipe( source( 'main.js' ) )
	.pipe( gulpif( production, buffer() ) )
	.pipe( gulp.dest( './build/js/' ) )
	.pipe( gulpif( production, uglify( { preserveComments: 'some' } ) ) )
	.pipe( rename( { extname: '.min.js' } ) )
	.pipe( gulp.dest( './build/js/' ) )
	.pipe( browserSync.reload( { stream: true } ) );

} );


gulp.task( 'watch', () => {

	gulp.watch( [ './src/js/**/*.js' ], () => {
		runSequence( 'browserify', browserSync.reload );
	} );

	gulp.watch( [ './src/scss/**/*.scss' ], () => {
		runSequence( 'sass', browserSync.reload );
	} );

} );


gulp.task( 'default', ( callback ) => {

	return runSequence( [ 'browser-sync', 'sass', 'browserify' ], 'watch', callback );

} );


gulp.task( 'build', ( callback ) => {

	production = true;
	return runSequence( [ 'sass', 'browserify' ], callback );

} );
