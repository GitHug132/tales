'use strict';
describe('Parser', function() {
  it('process a prueba tale as expected', function(done) {
    fetch('tales/prueba.tale').then((response) => { return response.text(); }).then((text) => {
      fetch('spec/fixtures/prueba.json').then((response) => { return response.json(); }).then((fixture) => {
        expect(JSON.stringify(parse(text))).toBe(JSON.stringify(fixture));
        done();
      });
    });
  });
});
