'use strict';

describe("El cuento simple 4", function() {
  it("es procesado debidamente", function(done) {

    var env = new Context();
    env.tell(function(context) {
      expect(context.title).toBe('Titulo del cuento 4');
      done();
    }, 'Titulo del cuento 4');

    env.run('spec/fixtures/cuento4.tale');
    console.log('finalizado 1');
  });
});

describe("El cuento simple 2", function() {
  it("es procesado debidamente", function(done) {
    console.log('comenzando 2');
    var env = new Context();
    env.tell(function(context2) {
      expect(context2.title).toBe('Titulo del cuento 2');

      env.tell(function(context3) {
        expect(context3.title).toBe('Titulo del cuento 3');
        done();

      }, 'Titulo del cuento 3');
    }, 'Titulo del cuento 2');

    env.run('spec/fixtures/cuento2.tale');
  });
});
