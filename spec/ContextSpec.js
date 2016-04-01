'use strict';
var Context = require('../tales.js').Context;

describe('El contexto', function() {
  it('corre bajo una promesa correctamente', function(done) {
    var env = new Context(),
        counter = 0;
    env.tell((context) => {
      counter++;
      expect(context.title).toBe('Titulo del cuento 1');
      env.tell((context) => {
        counter++;
        expect(context.title).toBe('Titulo del cuento 2');
        env.tell((context) => {
          counter++;
          expect(context.title).toBe('Titulo del cuento 3');
        }, 'Titulo del cuento 3');
      }, 'Titulo del cuento 2');
    }, 'Titulo del cuento 1');

    var p = env.run('spec/fixtures/cuento1.tale');
    expect(p.constructor.name).toBe("Promise");
    p.then((result) => {
      expect(counter).toBe(3);
      expect(result.ok).toBe(true);
      done();
    });
  });
  it('termina en error al no encontrar un cuento', function(done) {
    var env = new Context();

    env.tell((context) => {
    }, 'Titulo del cuento 2');

    /*
    env.tell((context) => {
    }, 'Titulo del cuento 3');
    */

    env.run('spec/fixtures/cuento2.tale').then(() => {
    }, (error) => {
      expect(error.message).toBe('not found "Titulo del cuento 3"');
      done();
    });
  });
  it('procesa un titulo segun una regex', function(done) {
    var env = new Context();

    env.tell((context) => {
      console.log('cuento 2');
    }, 'Titulo del cuento 2');

    env.tell((context) => {
      console.log('cuento 4');
    }, /Titulo del (\w+) (\d+)/);

    env.tell((context) => {
      console.log('cuento 3');
    }, /Titulo del cuento (\d+)/);

    env.run('spec/fixtures/cuento2.tale').then(() => {
      done();
    }, (error) => {
      done();
    });
  });
});

