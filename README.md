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
var Launcher = require('plexi.wordpress');

var wp = Launcher.create('a').start(process.stdout);

// able to launch multiple instance (watch the port conflict)
var wp2 = Launcher.create('b', {port: 8080,host:'localhost'}).start(process.stdout);
var wp3 = Launcher.create('c').start();

// stop process
wp.stop();
wp2.stop();
wp3.stop();
Launcher.stopAll();
```

##### extra attrs/methods
```js
// current process names
var names = Launcher.names();

// current processes
var processes = Launcher.processes();

// get process by name
var p = Launcher.get('mydb');

// get child process
var proc = Launcher.child;

// process cwd
console.log(wp.cwd);

// exec command
console.log(wp.command);

// process connect status(boolean)
console.log(wp.connected);

// process pid
console.log(wp.pid());
```

#### Install the executable
```sh
$ sudo npm install -g plexi.wordpress
...
wordpress version: (latest) 4.1 (enter wordpress version you want)
php location: (default) /Applications/MAMP/bin/php/php5.6.2/bin/php (enter php binary location)
...

$ wordpress
or
$ wordpress --port 8080 --host 127.0.0.1
[default] process started [/Applications/MAMP/bin/php/php5.6.2/bin/php -S 127.0.0.1:8080]
Wordpress started at "127.0.0.1:8080", docbase "/usr/local/lib/node_modules/plexi.wordpress/wordpress"
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