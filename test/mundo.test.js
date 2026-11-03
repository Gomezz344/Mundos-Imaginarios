const assert = require('node:assert/strict');
const { crearMundo } = require('../src/mundo');

const args = ['Una tormenta', 'Una ciudad flotante', 'rojo', 'azul', 'verde', 'dorado', 'violeta'];

(() => {
  const mundo = crearMundo(args);
  assert.match(mundo.id, /^[a-f0-9]{8}$/);
  assert.deepEqual(mundo.colores, args.slice(2));
  assert.ok(mundo.creadoEn);
})();

(() => {
  assert.equal(crearMundo(args).id, crearMundo(args).id);
})();

(() => {
  assert.throws(() => crearMundo(args.slice(0, 6)), /exactamente 7/);
  assert.throws(() => crearMundo(['a', 'b', 'rojo', 'ROJO', 'verde', 'dorado', 'violeta']), /distintos/);
})();

(() => {
  assert.throws(() => crearMundo([' ', 'b', 'rojo', 'azul', 'verde', 'dorado', 'violeta']), /vacíos/);
})();

console.log('Pruebas locales de mundo.js: OK');
