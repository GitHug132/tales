'use strict';
describe("El cuento simple 3", function() {
  it("es procesado debidamente", function(done) {

    // definimos aqui el contexto para el cuento 3
    tell(function(context) {
      // y una vez estamos dentro del contexto terminamos la prueba
      expect(context.title).toBe('Titulo del cuento 3');
      done();
    }, 'Titulo del cuento 3');

    // correr el cuento 3
    run('spec/fixtures/cuento3.tale');

  });
});

