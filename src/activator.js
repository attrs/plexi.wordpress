var path = require('path');
var fs = require('fs');
var wrench = require('wrench');

var instances = {};

module.exports = {
	start: function(ctx) {
		var http = ctx.require('plexi.http');
		
		var options = ctx.preference;
		var sourcedir = path.resolve(__dirname, '..', 'wordpress');
		
		var create = function(name, config) {
			if( !name || typeof name !== 'string' ) return console.error('wordpress name must be a string', name);
			if( instances[name] ) return console.error('already exists wordpress name', name);
			if( typeof config === 'string' ) config = {docbase:config};
			if( typeof config.docbase !== 'string' ) return console.error('invalid config.docbase', config.docbase);
	
			var docbase = config.docbase;
			
			if( !fs.existsSync(docbase) ) {
				//wrench.mkdirSyncRecursive(docbase, 0777);				
				wrench.copyDirSyncRecursive(sourcedir, docbase, {
					forceDelete: false,
					preserveFiles: true
				});
			}
			
			ctx.require('plexi.php');
			
			var router = http.create(name).docbase(docbase).filter('**/*', 'php').index('index.php');
			var mount = config.mount;
			if( mount && mount.path ) {
				if( mount.all ) {
					http.mountToAll(mount.path, router);
				} else if( mount.server ) {
					var server = http.server(mount.server);
					if( server ) server.mount(mount.path, router);
					else console.error('[wordpress] not found server', mount.server);
				} else {
					http.mount(mount.path, router);
				}
			}
		
			return instances[name] = router;
		};
		
		for(var k in options.instances) {
			create(k, options.instances[k]);
		}
		
		var exports = {
			create: create,
			remove: function(name) {
				delete instances[name];				
				return this;
			},
			get: function(name) {
				return instances[name];
			},
			names: function() {
				var names = [];
				for(var k in instances) names.push(k);
				return names;
			}
		};
		
		return exports;
	},
	stop: function(ctx) {
	}
};