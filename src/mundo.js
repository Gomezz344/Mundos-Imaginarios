const fs = require('node:fs');
const path = require('node:path');
const objectHash = require('object-hash');

const DATA_DIR = path.join(__dirname, '..', 'data');

function crearMundo(args) {
  if (!Array.isArray(args) || args.length !== 7) {
    throw new Error('Debes indicar exactamente 7 argumentos: situación, mundo y cinco colores.\nEjemplo: npm start -- "Una tormenta" "Una ciudad flotante" rojo azul verde dorado violeta');
  }
  const valores = args.map((valor) => String(valor).trim());
  if (valores.some((valor) => valor.length === 0)) throw new Error('La situación, el mundo y los colores no pueden estar vacíos.');
  const [situacion, mundo, ...colores] = valores;
  if (new Set(colores.map((color) => color.toLocaleLowerCase())).size !== 5) throw new Error('Los cinco colores deben ser distintos, sin diferenciar mayúsculas y minúsculas.');
  return { id: objectHash({ situacion, mundo, colores }).slice(0, 8), situacion, mundo, colores, creadoEn: new Date().toISOString() };
}

function guardarMundo(mundo) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const ruta = path.join(DATA_DIR, `mundo_${mundo.id}.json`);
  fs.writeFileSync(ruta, JSON.stringify(mundo, null, 2), 'utf8');
  return ruta;
}

function leerMundo(ruta) { return JSON.parse(fs.readFileSync(ruta, 'utf8')); }

module.exports = { crearMundo, guardarMundo, leerMundo };
