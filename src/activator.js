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
						"host": "localhost",
						"port": 9100
					}
				}
			});
			ctx.application.preferences.save();
		}
				
		for(var k in pref.instances) {
			Wordpress.create(k, pref.instances[k]);
		}
		
		return Wordpress;
	},
	stop: function(ctx) {
		Wordpress.stopAll();
	}
};