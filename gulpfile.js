const GULP           = require('gulp');
const FS             = require('fs');

//helpers
const PLUMBER        = require('gulp-plumber');
const RUNSEQUENCE    = require('run-sequence');
const RENAME         = require("gulp-rename");
const DEL            = require('del');
const INLINESOURCE   = require('gulp-inline-source');
const INCLUDE        = require('gulp-include');
const DATA           = require('gulp-data');
const IF             = require('gulp-if');
const CHANGED        = require('gulp-changed');
const CACHE          = require('gulp-cache'); //remove
const FILTER         = require('gulp-filter');
const HTTPREQUEST    = require('http-request');//remove
const HTTP           = require('http');//remove

//styles
const SASS           = require('gulp-sass');
const AUTOPREFIXER   = require('gulp-autoprefixer');
const CSSBEAUTIFY    = require('gulp-cssbeautify');
const CSSNANO        = require('gulp-cssnano');

//views
const PUG            = require('gulp-pug');
const PUGINHERITANCE = require('gulp-pug-inheritance');
const HTMLPRETTIFY   = require('gulp-html-prettify');
const DOM            = require("gulp-jsdom");

//transformer
var TRANSFORMER = require('jstransformer');
var T_MARKDOWN = TRANSFORMER(require('jstransformer-markdown'));
var T_SASS = TRANSFORMER(require('jstransformer-scss'));
var T_TWIG = TRANSFORMER(require('jstransformer-twig'));



//scripts
const UGLIFY         = require('gulp-uglify');

//media
const IMAGESIZE      = require('imagesize');//remove
const IMAGEINFO      = require('imageinfo');

//cosmetics
const BEEP           = require('beepbeep');
const NOTIFY         = require("gulp-notify");
const NOTIFIER       = require('node-notifier');
const BROWSERSYNC    = require('browser-sync').create();

//deploy
const GHPAGES        = require('gulp-gh-pages');


var check = false;


/***** variables *****/
//sources
var srcBase          = '_src/';
var srcStyles        = srcBase + '_styles/';
var srcScripts       = srcBase + '_scripts/';
var srcViews         = srcBase + '_views/';
var srcData          = srcBase + '_data/';

var srcAssets        = [
	srcBase + '**/*',
	srcBase + '**/.*',

	//compiled files
	'!' + srcData,
	'!' + srcData + '**/*',
	'!' + srcStyles,
	'!' + srcStyles + '**/*',
	'!' + srcViews,
	'!' + srcViews + '**/*',
	'!' + srcScripts,
	'!' + srcScripts + '**/*',

	//junk files
	'!' + srcBase + '**/.DS_Store',
	'!' + srcBase + '**/.Thumbs.db',
	'!' + srcBase + '**/.ehthumbs.db'
];

//directories
var dirTemp          = '_temp/';
var dirBuild         = 'build/';

//temp variables
var dataViews        = {base:{},context:{}};
var dev              = true;
var watch            = false;
var inline           = false;





/***** helpers *****/
var compileError = function(e) {
	BEEP();
	console.log( e.stack );

	NOTIFIER.notify({
		title: 'Gulp',
		message: 'Error with build.',
	});
}

var gazeError = function(e) {
	//https://github.com/gulpjs/gulp/issues/427
	//https://github.com/gulpjs/gulp/issues/651
	// silently catch 'ENOENT' error typically caused by renaming watched folders
	if (e.code === 'ENOENT') {
		console.log('Folder gaze error.');
		return;
	}
}

var viewsNesting = function(path) {
	if( path.indexOf('__') != 0 ) {
		var folders = path.split('__');

		if( path != 'index' ) {
			path = '';
			for(var i = 0; i < folders.length; i++) {
				path += '/' + folders[i];
			}
			path += '/'; //final slash
		}else{
			path = '/';
		}
	}else {
		path = '/';
	}

	return path;
}

var domAppend = function(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

var getImageDimensions = function(src) {
	FS.readFile(src, function(err, data) {
		if (err) {
			throw err;
			return false;
		}

		info = IMAGEINFO(data);
		console.log("Data is type:", info.mimeType);
		console.log("  Size:", data.length, "bytes");
		console.log("  Dimensions:", info.width, "x", info.height);

		return info;
	});

	return false;
}


GULP.task('serverReload', async function() {
	if(watch) {
		await BROWSERSYNC.reload();
	}
});

/***** basic file handling *****/
GULP.task('cleanBuild', GULP.series(function(callback) {
	DEL.sync( dirBuild );
	callback();
}));

GULP.task('cleanTemp', GULP.series(function(callback) {
	DEL.sync( '_temp' );
	callback();
}));

GULP.task('copyFiles', GULP.series(function(callback){
	//excludes _styles, _scripts, & _views
	GULP.src( srcAssets )
	.pipe( PLUMBER({
		errorHandler: compileError
	}) )
	.pipe( GULP.dest( dirBuild ) )


	//assets files copied!
	.pipe( IF( watch, BROWSERSYNC.reload({ stream: true }) ) )
	.pipe( PLUMBER.stop() );

	callback();
}));

/***** data *****/
//finds all data in the /_views/data folder and includes it in compile
GULP.task('data', GULP.series(function(callback){
	GULP.src( srcData + '*.+(json)' )
	.pipe( DATA(function(file){
		//gets name of file excluding json extension
		var path = file.history[0].replace(file.base, '').split('.');
		path.pop();
		path = path.join('.');

		//passes data over in context as filename
		dataViews.context[path] = JSON.parse(file.contents.toString());
	}) );

	callback();
}));


/***** styles *****/
//Compiles sass files and exports minified and unminified css files
GULP.task('styles', GULP.series(function(callback){
	GULP
	//get styles from srcStyles and make sass happen
	.src( srcStyles + '*.+(scss|sass|css)' ) //grabs scss sass and css files
	.pipe( PLUMBER({ errorHandler: compileError	}) )
	.pipe( SASS() )
	.pipe( AUTOPREFIXER({
		browsers: ['last 4 versions'],
		cascade: false
	}) )


	//unminified css
	.pipe( CSSBEAUTIFY() ) //pretty looking css for the unminified styles
	.pipe( RENAME(function (path) {
		//cleans up files that already have .min in the css file to prevent a double .min
		if(path.extname == '.css') {
			var newPath = path.basename;
			path.basename = newPath.split('.min').join('');
		}
	}))
	.pipe( GULP.dest( dirBuild + 'assets/css/' ) ) //saves unminified


	//minified css
	.pipe( RENAME({	suffix: ".min" }) ) //add .min
	.pipe( CSSNANO() ) //minify it!
	.pipe( GULP.dest( dirBuild + 'assets/css/' ) ) //saves minified


	//styles done!
	.pipe( IF( watch, BROWSERSYNC.reload({ stream: true }) ) )
	.pipe( PLUMBER.stop() );

	callback();
}));


/***** scripts *****/
GULP.task('scripts', GULP.series(function(callback) {
	GULP


	//gets .js files for compile, will support .ts and maybe .coffee later
	.src( srcScripts + '*.+(js)' )
	.pipe( PLUMBER({ errorHandler: compileError }) )
	.pipe( INCLUDE() ) //includes/requires other files in export


	//unminified js
	.pipe( GULP.dest( dirBuild + 'assets/js/' ) )


	//minified js
	.pipe( UGLIFY() ) //make me ugly and small
	.pipe( RENAME({ suffix: ".min" }) ) //add .min
	.pipe( GULP.dest( dirBuild + 'assets/js/' ) )


	//js finished!
	.pipe( IF( watch, BROWSERSYNC.reload({ stream: true }) ) )
	.pipe( PLUMBER.stop() );

	callback();
}));

/***** views *****/

//Compiles pug/jade and exports it into a temp folder
GULP.task('views', GULP.series(function(callback){
	GULP
	//gets all pug files (also supports jade still)
	.src( srcViews + '**/*.+(pug|jade)' )
	.pipe( PLUMBER({ errorHandler: compileError }) )


	//only compiles changed files
	.pipe( IF( check, CHANGED( dirTemp, {extension: '.html'} ) ) )
	.pipe( IF( check, PUGINHERITANCE({basedir: srcViews, skip: 'node_modules'}) ) )


	//passes data to pug file
	.pipe( DATA(function (file) {
		//gets filename
		var path = file.history[0].replace(file.base, '').split('.');
		path.pop();
		path = path.join('.');

		var core = {};


		//Build Data
		core.dev              = dev;
		core.dev_url          = 'http://localhost:3000'; //localhost port 3000 default
		core.url              = '';
		core.version          = '0.0';


		//SEO Settings
		core.path             = viewsNesting(path); //passes file path to pug file (really only needed for seo canonical)
		core.site_name        = 'Website Name';
		core.title            = 'Website Title';
		core.description      = 'Website Description';
		core.og               = {
			'type' : 'website',
			'title' : false,
			'description' : false,
		}
		core.twitter          = {
			'card' : 'summary',
			'site' : false,
			'title' : false,
			'description' : false,
		}
		core.canonical        = false;
		core.robots           = false;


		//HTML Settings
		core.lang             = 'en';
		core.locale           = 'en_US';
		core.viewport         = 'width=device-width, initial-scale=1, shrink-to-fit=no';


		//Post/Page Info
		core.id               = 0;


		//External Resources
		core.google_analytics = false;
		core.typekit          = false;


		dataViews.core        = core; //passes base to use in pug files

		//you've got global data in your pug/jade files!
		return dataViews;
	}) )


	//compiles pug
	.pipe( PUG() )
	.pipe( HTMLPRETTIFY({
		indent_char: '	',
		indent_size: 1
	}) )


	//exports to temp file to compare unchanged files
	.pipe( GULP.dest( dirTemp ) )

	.pipe( FILTER(function (file) {
		var p = file.relative.indexOf('/');

		if(p == -1) {
			return true;
		}else{
			return false;
		}
	}) )


	//flat file renaming process
	.pipe( RENAME(function (path) {
		p = path.dirname;
		var newPath = path.basename; //gets file base name

		if( newPath.indexOf('__') != 0 ) { //files that start with __ are excluded from the flat file build convention
			path.basename = viewsNesting(path.basename) + 'index'; //new folder and index file for each file
		} else {
			path.basename = (path.basename).substring(2); //exports {{filename}}.html at the root
		}

	}) )
	.pipe( GULP.dest( dirBuild ) )


	.pipe( PLUMBER.stop() )

	callback();
}));

GULP.task('viewsCheck', GULP.series(
	'data',
	'views',
	'serverReload',
	function(callback){
		check = true;
		callback();	
	}
));

GULP.task('viewsForce', GULP.series(
	'data',
	'views',
	'serverReload',
	function(callback){
		check = false;
		callback();
	}
));

GULP.task('image', GULP.series(function(callback){
	GULP
	.src( dirBuild + '*.+(html)' )
	.pipe( DOM(function(document){
		var images = document.getElementsByTagName('img');
		for(var i = 0; i < images.length; i++) {
			var img = images[i];
			if( img.hasAttribute("padme") ) {
				var classes = img.className;
				var src = img.src;
				src = src.replace("http://localhost:3000/", srcBase);

				var imgWrap = document.createElement('div');
				imgWrap.style.paddingTop = "100%";

				imgWrap.className = 'padme ';
				imgWrap.className += classes;
				imgWrap.innerHTML = '<img src="' + img.src + '">';

				domAppend(imgWrap, img);

				img.parentNode.removeChild(img);
				i--;
			}
		}
	}) )
	.pipe( GULP.dest('test/') );

	callback();
}));


/***** server *****/
GULP.task('server', GULP.series(function() {
	BROWSERSYNC.init({
		server: {
			baseDir: 'build'
		},
		notify: false,
		ghostMode: false,
		open: false
	})
}));



/***** tasks to run *****/
GULP.task('default', function(done) {
	console.log(' ');
	console.log('Hi there! Below are a few useful commands:');
	console.log(' ');
	console.log('watch: Builds and watches files for local development.');
	console.log('dev:   Similar to watch, but allows inlining assets and can be slower.');
	console.log('dist:  Just like dev but flagged for distribution.');
	console.log(' ');
	done();
});

//local build process for development
GULP.task('build', GULP.series(
	['cleanBuild', 'cleanTemp'],
	['styles', 'scripts'],
	'viewsForce', 'copyFiles',
	function(callback){
		callback();
	}
));

//watch build task
GULP.task('watch', GULP.series(['server', 'build'], function (){
	watch = true;

	GULP.watch( srcData + '**/*', ['viewsForce'] ).on('error', gazeError);
	GULP.watch( srcStyles + '**/*', ['styles'] ).on('error', gazeError);
	GULP.watch( srcScripts + '**/*', ['scripts'] ).on('error', gazeError);
	GULP.watch( srcViews + '**/*', ['viewsCheck'] ).on('error', gazeError);

	GULP.watch( srcAssets, ['copyFiles'] ).on('error', gazeError);
}));

//distribution build
GULP.task('dist', function (callback) {
	dev = false;
	dirBuild = 'dist/';
	RUNSEQUENCE(
		'build',
		callback
	);
});

//github pages deployment
GULP.task('githubDeploy', GULP.series(function() {
	return GULP.src('dist/**/*')
	.pipe( GHPAGES() );
}));


GULP.task('devBuild', GULP.series(function(callback){
	inline = true;

	RUNSEQUENCE(
		['cleanBuild', 'cleanTemp'],
		['styles', 'scripts', 'copyFiles'],
		['stylesBuild', 'scriptsBuild', 'views'],
		'cleanTemp',
		callback
	)
}));

GULP.task('dev', GULP.series('server', 'devBuild', function(){
	GULP.watch( [srcBase + '**/*'], ['devBuild'] ).on('error', gazeError);
}));
