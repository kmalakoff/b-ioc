var A = require('./a');
var B = require('./b');
var C = require('./c');
var MakeClass = require('./make');

var Ioc = require('../src');

Ioc.bind('a', (name) => new A(name));

Ioc.bind('b', (name) => new B(Ioc.use('a', name)));

Ioc.bind('c', (name1, name2) => new C(Ioc.use('a', name1), Ioc.use('b', name2)));

var jack = Ioc.use('a', 'Jack');
var jill = Ioc.use('b', 'Jill');
var couple = Ioc.use('c', 'Brandon', 'Corinne');
var make = Ioc.make(MakeClass);

jack.hello();
jill.hello();
couple.hello();
make.hello();
