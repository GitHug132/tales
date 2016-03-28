'use strict';

/*
describe("El cuento simple 4", function() {
  it("es procesado debidamente", function(done) {

    tell(function(context) {
      expect(context.title).toBe('Titulo del cuento 4');
      done();
    }, 'Titulo del cuento 4');

    run('spec/fixtures/cuento4.tale');
    console.log('finalizado 1');
  });
});
*/

describe("El cuento simple 2", function() {
  it("es procesado debidamente", function(done) {

    tell(function(context) {
      expect(context.title).toBe('Titulo del cuento 4');
    }, 'Titulo del cuento 4');

    run('spec/fixtures/cuento4.tale');

    setTimeout(function() {
    console.log('comenzando 2');
    tell(function(context2) {
      expect(context2.title).toBe('Titulo del cuento 2');

      tell(function(context3) {
        expect(context3.title).toBe('Titulo del cuento 3');
        done();

      }, 'Titulo del cuento 3');
    }, 'Titulo del cuento 2');

    run('spec/fixtures/cuento2.tale');
    }, 100);
  });
});
