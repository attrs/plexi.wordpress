var Launcher = require('./Launcher.js');
var path = require('path');
var fs = require('fs');

module.exports = {
	start: function(ctx) {
		var options = ctx.preference;
		var ws = ctx.workspace;
		
		var create = function(name, config) {			
			var out = config.console ? process.stdout : null;
			Launcher.create(k, config).start(out);
			console.log('* Wordpress Started. [' + k + ':' + (config.port) + ']');
		};
		
		var instances = options.instances;
		for(var k in instances) {
			create(k, instances[k]);
		}
				
		return {
			create: function(name, config) {
				return create(name, config);
			},
			remove: function(name) {
				return Launcher.remove(name);
			},
			names: function() {
				return Launcher.names();
			},
			get: function(name) {
				return Launcher.get(name);
			},
			stop: function(name) {
				var p = Launcher.get(name);
				if( p ) return p.stop();
			},
			Launcher: Launcher
		};
	},
	stop: function(ctx) {
		Launcher.stopAll();
		console.log('* All Wordpress Process Stopped');
	}
};