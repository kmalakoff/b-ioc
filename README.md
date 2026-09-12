# b-ioc-js

A tiny, magic-free IoC container for Node.js. Bind factories by name, then resolve them where you need them.

## Installation

```sh
npm install b-ioc-js
```

## Usage

```js
var Ioc = require('b-ioc-js');

Ioc.clear();
Ioc.bind('config', function() {
  return { greeting: 'Hello' };
});

Ioc.bind('greeter', function() {
  var config = Ioc.use('config');
  return { greet: function(name) {
    return config.greeting + ', ' + name;
  }};
});

console.log(Ioc.use('greeter').greet('Ada')); // Hello, Ada
```

`bind(name, factory)` resolves a new value each time. `singleton(name, factoryOrValue)` resolves a value once. `make(Class)` constructs a class using dependency names returned by its static `inject()` method. `clear()` resets the process-wide container.

Bindings must use unique names. The container does not inspect constructor parameters or automatically discover dependencies; factories and `inject()` provide them explicitly.

Node.js >= 0.8 is supported.

## License

MIT
