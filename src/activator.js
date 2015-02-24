var path = require('path');
var fs = require('fs');
var util = require('attrs.util');
var Wordpress = require('./Wordpress.js');

module.exports = {
	start: function(ctx) {
		var pref = ctx.preference;
		
		// write default preference to plexi.json
		if( !pref ) {
			pref = ctx.application.preferences.set('plexi.wordpress', {
				"instances": {
					"default": {
						"console": false,
						"docbase": "wordpress",
						"port": 9100
					}
				}
			});
			ctx.application.preferences.save();
		}
				
		for(var k in pref.instances) {
			var wordpress = Wordpress.create(k, pref.instances[k]);
			util.debug('wordpress', 'starting at', wordpress.options.docbase);
			wordpress.ensureInstall(function(err) {
				if( err ) return util.error(err);
	
				wordpress.start();
			});
		}
		
		return Wordpress;
	},
	stop: function(ctx) {
		Wordpress.stopAll();
	}
};