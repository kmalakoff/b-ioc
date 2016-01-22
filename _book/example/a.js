function A(name) {
  this.name = name || 'brandon';
  console.log('Module A constructed with args', arguments)
}

A.prototype.hello = function() {
  console.log(`Module A says hello ${this.name}!`);
}

module.exports = A;
