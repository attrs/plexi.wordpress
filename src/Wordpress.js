var path = require('path');
var fs = require('fs');
var wrench = require('wrench');
var util = require('attrs.util');
var spawn = require('child_process').spawn;

var source, phpbin;

function Wordpress(options) {
	if( typeof options === 'string' ) options = {docbase:options};
	if( typeof options.docbase !== 'string' ) throw new Error('options.docbase must be a string:' + options.docbase);
	if( typeof options.port !== 'number' ) throw new Error('options.port must be a number:' + options.port);
	
	if( !source || !phpbin ) {
		var configini = require('ini').parse(fs.readFileSync(path.resolve(__dirname, '../config.ini'), 'utf-8'));
		source = configini.source;
		phpbin = configini.phpbin;
	}
	
	this.source = options.source || source;
	this.phpbin = options.phpbin || phpbin || 'php';
	this.options = options;
	
	if( !this.source ) throw new Error('config.ini/source: not defined config.ini/source');
	if( !fs.existsSync(path.join(this.source, 'wp-load.php')) ) throw new Error('invalid wordpress source path:' + this.source);
}

Wordpress.prototype = {
	ensureInstall: function(callback) {
		if( typeof callback !== 'function' ) throw new TypeError('callback must be a function');
				
		try {
			var docbase = this.options.docbase;
			if( !fs.existsSync(docbase) ) {
				wrench.copyDirSyncRecursive(this.source, docbase, {
					forceDelete: false,
					preserveFiles: true
				});
			}
			
			if( !fs.existsSync(path.join(docbase, 'wp-load.php')) ) {
				throw new Error('invalid wordpress docbase:' + docbase);
			}
		
			callback(null, docbase);
		} catch(err) {
			callback(err);
		}
		
		return this;
	},
	isRunning: function() {
		return this.process && this.process.connected;
	},
	start: function(stdout, stderr) {
		var options = this.options;
		var docbase = options.docbase;
		var host = options.host || '127.0.0.1';
		var port = options.port;
		var env = options.env || {};
		var phpbin = this.phpbin;
		var self = this;
		
		var ps = this.process = spawn(phpbin, ['-S', host + ':' + port], {
			encoding: 'utf8',
			cwd: docbase,
			env: env
		}).on('close', function (code, signal) {
			if( code === 0 ) util.debug('wordpress', 'closed', code);
			else util.error('wordpress', 'closed with error', code);
		}).on('error', function(err) {
			util.error('wordpress', 'error', err);
		});
		
		ps.stdout.setEncoding('utf8');
		ps.stderr.setEncoding('utf8');
	
		if( stdout || options.console ) ps.stdout.pipe(stdout || process.stdout);
		if( stderr || stdout || options.console  ) ps.stderr.pipe(stderr || stdout || process.stderr);
		
		this.docbase = docbase;
		this.host = host;
		this.port = port;
		
		util.debug('wordpress', 'started', this.phpbin, ['-S', this.host + ':' + this.port]);
		return this;
	},
	stop: function() {
		var code = this.process && this.process.connected && this.process.kill();		
		util.debug('wordpress', 'stopped', this.phpbin, ['-S', this.host + ':' + this.port]);
		return code;
	}
};

var instances = {};
module.exports = {
	get: function(name) {
		return instances[name];
	},
	create: function(name, options) {
		if( !name || typeof name !== 'string' ) return util.error('wordpress', 'name must be a string', name);
		if( instances[name] ) return util.error('wordpress', 'already exists name', name);
		
		try {
			return instances[name] = new Wordpress(options);
		} catch(err) {
			util.error('wordpress', 'create error', err);
		}
	},
	remove: function(name) {
		var wp = instances[name];
		if( wp ) wp.stop();
		delete instances[name];
		return this;
	},
	names: function() {
		var args = [];
		for(var k in instances) {
			if( instances[k] instanceof Wordpress ) args.push(k);
		}
		return args;
	},
	instances: function() {
		var args = [];
		for(var k in instances) {
			if( instances[k] instanceof Wordpress ) args.push(instances[k]);
		}
		return args;
	},
	startAll: function() {
		for(var k in instances) {
			var wp = instances[k];
			if( wp instanceof Wordpress ) {
				wp.ensureInstall(function(err, result) {
					if( err ) return util.error('wordpress', 'start error', err);
					wp.start();
				});
			}
		}
		
		return this;
	},
	stopAll: function() {
		for(var k in instances) {
			var wp = instances[k];
			if( wp instanceof Wordpress ) wp.stop();
		}
		
		return this;
	}
};