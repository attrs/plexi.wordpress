var path = require('path');
var Wordpress = require('../');


var wordpress = Wordpress.create('example', {
	port: 9200,
	docbase: path.resolve(__dirname, 'wordpress'),
	console: true
});

wordpress.ensureInstall(function(err) {
	if( err ) return console.error(err);
	
	wordpress.start();
});