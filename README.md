# plexi.wordpress

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Gratipay][gratipay-image]][gratipay-url]
[![Build Status][travis-image-flat]][travis-url]

Automatically install & launch WordPress.

### Examples
#### Programmatically Launch
##### Installation
```sh
$ npm install plexi.wordpress --save
```

##### package usage
```js
var wordpress = Wordpress.create('example', {
	host: '127.0.0.1',
	port: 9200,
	docbase: path.resolve(process.cwd(), 'wordpress'),
	console: true
});

wordpress.ensureInstall(function(err) {
	if( err ) return util.error(err);
	
	wordpress.start();
});

// stop service
wordpress.stop();

// stop all instances
Wordpress.stopAll();
```

##### extra attrs/methods
```js
// current instance names
var names = Wordress.names();

// current instances
var instances = Wordress.instances();

// get insatnce by name
var wp = Wordress.get('example');

// get child process
var proc = wp.process;

// instance docbase
console.log(wp.docbase);

// instance host
console.log(wp.host);

// instance port
console.log(wp.port);

// instance status
console.log(wp.isRunning());

// process pid
console.log(wp.process.pid());
```

#### Install the executable
```sh
$ sudo npm install -g plexi.wordpress
$ wordpress
or
$ wordpress --port 8080 --host 127.0.0.1
.....
```

### License

  [MIT](LICENSE)
  

 [npm-image]: https://img.shields.io/npm/v/plexi.wordpress.svg?style=flat
 [npm-url]: https://npmjs.org/package/plexi.wordpress
 [downloads-image]: https://img.shields.io/npm/dm/plexi.wordpress.svg?style=flat
 [downloads-url]: https://npmjs.org/package/plexi.wordpress
 [travis-image-flat]: https://img.shields.io/travis/attrs/plexi.wordpress.svg?style=flat
 [travis-image]: https://travis-ci.org/attrs/plexi.wordpress.svg?branch=master
 [travis-url]: https://travis-ci.org/attrs/plexi.wordpress
 [gratipay-image]: https://img.shields.io/gratipay/teamattrs.svg?style=flat
 [gratipay-url]: https://gratipay.com/teamattrs/