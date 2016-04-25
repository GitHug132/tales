'use strict';
var parse = require('../tales.js').parse;

describe('Parser', function() {
  it('procesa un cuento de "prueba" correctamente', function(done) {
    fetch('spec/fixtures/prueba.tale').then((response) => { return response.text(); }).then((text) => {
      fetch('spec/fixtures/prueba.json').then((response) => { return response.json(); }).then((fixture) => {
        expect(JSON.stringify(parse(text))).toBe(JSON.stringify(fixture));
        done();
      });
    });
  });

  it('procesa un cuento de "prueba 2" correctamente', function(done) {
    fetch('spec/fixtures/prueba2.tale').then((response) => { return response.text(); }).then((text) => {
      fetch('spec/fixtures/prueba2.json').then((response) => { return response.json(); }).then((fixture) => {
        expect(JSON.stringify(parse(text))).toBe(JSON.stringify(fixture));
        done();
      });
    });
  });
});
