#!/usr/bin/env node

'use strict';

var argv = require('attrs.argv');
var c = require('chalk');
var pkg = require('../package.json');
var Launcher = require('../src/Launcher.js');

process.title = pkg.name;
process.on('SIGINT', function () {
	Launcher.stopAll();	
	process.exit();
});

var wp = Launcher.create('default', argv).start(process.stdout);

console.log(c.cyan('Wordpress started') + ' at ' + c.green('"' + wp.host + ':' + wp.port + '"') + ', docbase ' + c.green('"' + wp.cwd + '"'));
