#!/usr/bin/env node

var path = require('path');
var util = require('attrs.util');
var pkg = require('../package.json');
var Wordpress = require('../');
var argv = util.argv();

process.title = pkg.name;

var wordpress = Wordpress.create('example', {
	host: argv.host || '127.0.0.1',
	port: parseInt(argv.port) || 9200,
	docbase: path.resolve(process.cwd(), 'wordpress'),
	console: true
});

util.debug('wordpress', 'starting at', wordpress.options.docbase);
wordpress.ensureInstall(function(err) {
	if( err ) return util.error(err);
	
	wordpress.start();
});

process.on('SIGINT', function () {
	wordpress.stop();	
	process.exit();
});